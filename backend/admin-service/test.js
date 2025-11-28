import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import Stripe from 'stripe';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const rawBodyMiddleware = bodyParser.raw({ type: 'application/json' });

// === MONGOOSE CONNECTION ===
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => console.log('✅ MongoDB conectado'));
mongoose.connection.on('error', (err) => console.error('MongoDB error:', err));

// === MODELOS ===
const orderItemSchema = new mongoose.Schema({
    ticketTypeId: String,
    quantity: Number,
    unitPrice: Number,
});
const productItemSchema = new mongoose.Schema({
    productId: String,
    quantity: Number,
    unitPrice: Number,
});

const Order = mongoose.model(
    'Order',
    new mongoose.Schema({
        id: { type: String, unique: true },
        userId: String,
        totalAmount: Number,
        status: { type: String, enum: ['PENDING', 'PAID', 'FAILED'], default: 'PENDING' },
        items: [orderItemSchema],
        products: [productItemSchema],
        createdAt: { type: Date, default: Date.now },
        updatedAt: Date,
    })
);

const Payment = mongoose.model(
    'Payment',
    new mongoose.Schema({
        id: { type: String, unique: true },
        orderId: String,
        amount: Number,
        method: String,
        transactionRef: String,
        currency: String,
        status: { type: String, enum: ['PENDING', 'COMPLETED'], default: 'PENDING' },
        createdAt: { type: Date, default: Date.now },
        paidAt: Date,
    })
);

const Product = mongoose.model(
    'Product',
    new mongoose.Schema({
        id: { type: String, unique: true },
        name: String,
        stockAvailable: Number,
        price: Number,
    })
);

const TicketType = mongoose.model(
    'TicketType',
    new mongoose.Schema({
        id: { type: String, unique: true },
        eventId: String,
        name: String,
        stockAvailable: Number,
        price: Number,
    })
);

const Ticket = mongoose.model(
    'Ticket',
    new mongoose.Schema({
        id: { type: String, unique: true },
        orderItemId: String,
        userId: String,
        eventId: String,
        ticketTypeId: String,
        uniqueCode: String,
        status: { type: String, enum: ['VALID', 'USED', 'CANCELLED'], default: 'VALID' },
    })
);

// === MIDDLEWARES ===
app.use(cors({ origin: process.env.FRONTEND_URL }));
const apiRouter = express.Router();
apiRouter.use(express.json());

// === ENDPOINT: CREATE PAYMENT INTENT ===
apiRouter.post('/create-payment-intent', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { userId, items = [], products = [], currency = "eur" } = req.body;
        if (!userId || (items.length === 0 && products.length === 0)) {
            return res.status(400).json({ error: 'userId y al menos un item son requeridos' });
        }

        const total =
            items.reduce((s, it) => s + it.quantity * it.unitPrice, 0) +
            products.reduce((s, p) => s + p.quantity * p.unitPrice, 0);

        const orderId = `order-${uuidv4()}`;
        const paymentIntentIdempotencyKey = `pi-request-${uuidv4()}`;

        // 1️⃣ Crear la orden
        await Order.create(
            [
                {
                    id: orderId,
                    userId,
                    totalAmount: total,
                    items,
                    products,
                    status: 'PENDING',
                },
            ],
            { session }
        );

        // 2️⃣ Crear PaymentIntent en Stripe
        const paymentIntent = await stripe.paymentIntents.create(
            {
                amount: Math.round(total * 100),
                currency,
                metadata: { orderId },
            },
            { idempotencyKey: paymentIntentIdempotencyKey }
        );

        // 3️⃣ Registrar pago en MongoDB
        await Payment.create(
            [
                {
                    id: `pay-${uuidv4()}`,
                    orderId,
                    amount: total,
                    method: 'Stripe',
                    transactionRef: paymentIntent.id,
                    currency,
                    status: 'PENDING',
                },
            ],
            { session }
        );

        await session.commitTransaction();

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            orderId,
        });
    } catch (err) {
        await session.abortTransaction();
        console.error(err);
        res.status(500).json({ error: 'error_creating_payment' });
    } finally {
        session.endSession();
    }
});

app.use("/api", apiRouter); // rutas normales bajo /api

// === WEBHOOK STRIPE ===
app.post('/webhook', rawBodyMiddleware, async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed.', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded' || event.type === 'charge.succeeded') {
        const pi = event.data.object;
        const transactionRef = pi.id;
        const orderId = pi.metadata?.orderId;

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // 1️⃣ Actualizar o crear pago
            let payment = await Payment.findOne({ transactionRef }).session(session);
            if (!payment) {
                payment = await Payment.create(
                    [
                        {
                            id: `pay-${uuidv4()}`,
                            orderId,
                            amount: (pi.amount_received || pi.amount) / 100,
                            method: 'Stripe',
                            transactionRef,
                            currency: pi.currency,
                            status: 'COMPLETED',
                            paidAt: new Date(),
                        },
                    ],
                    { session }
                );
            } else if (payment.status !== 'COMPLETED') {
                payment.status = 'COMPLETED';
                payment.paidAt = new Date();
                await payment.save({ session });
            }

            // 2️⃣ Cargar orden
            const order = await Order.findOne({ id: orderId }).session(session);
            if (!order) throw new Error('Order not found');

            // 3️⃣ Verificar stock de tickets
            for (const item of order.items) {
                const tt = await TicketType.findOne({ id: item.ticketTypeId }).session(session);
                if (!tt || tt.stockAvailable < item.quantity) {
                    order.status = 'FAILED';
                    await order.save({ session });
                    throw new Error(`Stock insuficiente para ticketType ${item.ticketTypeId}`);
                }

                tt.stockAvailable -= item.quantity;
                await tt.save({ session });

                // Generar tickets
                for (let i = 0; i < item.quantity; i++) {
                    await Ticket.create(
                        [
                            {
                                id: `tck-${uuidv4()}`,
                                orderItemId: item._id,
                                userId: order.userId,
                                eventId: tt.eventId,
                                ticketTypeId: tt.id,
                                uniqueCode: `TCK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                            },
                        ],
                        { session }
                    );
                }
            }

            // 4️⃣ Verificar stock de productos
            for (const p of order.products) {
                const prod = await Product.findOne({ id: p.productId }).session(session);
                if (!prod || prod.stockAvailable < p.quantity) {
                    order.status = 'FAILED';
                    await order.save({ session });
                    throw new Error(`Stock insuficiente para producto ${p.productId}`);
                }
                prod.stockAvailable -= p.quantity;
                await prod.save({ session });
            }

            // 5️⃣ Marcar orden como PAID
            order.status = 'PAID';
            order.updatedAt = new Date();
            await order.save({ session });

            await session.commitTransaction();
            console.log(`✅ Orden ${orderId} completada correctamente`);
            return res.json({ received: true });
        } catch (err) {
            await session.abortTransaction();
            console.error('❌ Error procesando webhook:', err);
            return res.status(500).send();
        } finally {
            session.endSession();
        }
    }

    res.json({ received: true });
});

// === SERVER START ===
const port = process.env.PORT || 4242;
app.listen(port, () => console.log(`🚀 Server listening on port ${port}`));
