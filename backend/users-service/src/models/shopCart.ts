import { Schema, model, Types } from 'mongoose';
import './merch';
import './merchCategory';
import { ITicketSchemaMethods } from './tickets';
import { IMerchMethods } from './merch';

interface ICartItem {
    itemId: Types.ObjectId;
    quantity: number;
}

interface IShoppingCart {
    userId: Types.ObjectId;
    tickets: ICartItem[];
    merch: ICartItem[];
    status: 'PENDING' | 'SUCCESS' | 'CANCELLED';
}

interface IShoppingCartMethods {
    toUserResponse: () => Promise<any>
}

const cartItemSchema = new Schema<ICartItem>({
    itemId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
    }
}, { _id: false });

const shoppingCartSchema = new Schema<IShoppingCart>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    tickets: [cartItemSchema],
    merch: [cartItemSchema],
    status: {
        type: String,
        enum: ['PENDING', 'SUCCESS', 'CANCELLED'],
        default: 'PENDING',
    },
}, {
    timestamps: true,
});

shoppingCartSchema.pre(/^find/, function() {
    //@ts-ignore
    this.where({ status: 'PENDING' });
})

shoppingCartSchema.methods.toUserResponse = async function() {
    await this.populate([
        { path: 'tickets.itemId', model: 'ConcertTicket' },
        { path: 'merch.itemId', model: 'Merch' }
    ]);

    const tickets = await Promise.all(this.tickets.map(async (item: any) => ({
        item: await (item.itemId as ITicketSchemaMethods).toUserResponse(),
        quantity: item.quantity
    })))

    const merch = await Promise.all(this.merch.map(async (item: any) => ({
        item: await (item.itemId as IMerchMethods).toUserResponse(),
        quantity: item.quantity
    })))

    return {
        tickets,
        merch
    }
}

export const ShoppingCart = model<IShoppingCart & IShoppingCartMethods>('ShoppingCart', shoppingCartSchema);
