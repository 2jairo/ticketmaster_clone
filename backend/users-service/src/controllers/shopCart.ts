import asyncHandler from "express-async-handler";
import { ShoppingCart } from "../models/shopCart";
import { ErrKind, LocalError } from "../error/err";
import { Types } from "mongoose";


const upsertCart = async (userId: string) => {
    const shoppingCart = await ShoppingCart.findOne({ userId })

    if (!shoppingCart) {
        return ShoppingCart.create({
            merch: [],
            tickets: [],
            userId
        })
    }
    return shoppingCart
}

const formatItems = (items: { quantity: number, itemId: string }[]) => {
    if (!Array.isArray(items)) {
        throw new LocalError(ErrKind.BadRequest, 400, "Items must be an array");
    }

    return items.map(item => {
        if (!item.itemId || !Types.ObjectId.isValid(item.itemId)) {
            throw new LocalError(ErrKind.BadRequest, 400, "Invalid item ID");
        }
        if (typeof item.quantity !== 'number') {
            throw new LocalError(ErrKind.BadRequest, 400);
        }
        return item
    });
}

export const updateShoppingCart = asyncHandler(async (req, res) => {
    const { tickets, merch } = req.body;

    const shoppingCart = await upsertCart(req.userId)

    if (tickets !== undefined) {
        const newTickets = formatItems(tickets);

        for (const newItem of newTickets) {
            if(newItem.quantity <= 0) {
                shoppingCart.tickets = shoppingCart.tickets.filter((t) => t.itemId.toString() !== newItem.itemId)
                continue
            }

            const existing = shoppingCart.tickets.find((t) => t.itemId.toString() === newItem.itemId)
            if (existing) {
                existing.quantity = newItem.quantity;
            } else {
                shoppingCart.tickets.push({
                    itemId: new Types.ObjectId(newItem.itemId),
                    quantity: newItem.quantity
                })
            }
        }
    }
    if (merch !== undefined) {
        const newMerch = formatItems(merch);

        for (const newItem of newMerch) {
            if(newItem.quantity <= 0) {
                shoppingCart.merch = shoppingCart.merch.filter((t) => t.itemId.toString() !== newItem.itemId)
                continue
            }

            const existing = shoppingCart.merch.find((m) => m.itemId.toString() === newItem.itemId);
            if (existing) {
                existing.quantity = newItem.quantity
            } else {
                shoppingCart.merch.push({
                    itemId: new Types.ObjectId(newItem.itemId),
                    quantity: newItem.quantity
                })
            }
        }
    }

    const updated = await shoppingCart.save();
    res.status(200).json(await updated.toUserResponse());
});

export const getShoppingCart = asyncHandler(async (req, res) => {
    const shoppingCart = await upsertCart(req.userId)

    if (!shoppingCart) {
        throw new LocalError(ErrKind.CartNotFound, 404, "Shopping cart not found")
    }

    res.status(200).json(await shoppingCart.toUserResponse())
})

export const clearCart = asyncHandler(async (req, res) => {
    const shoppingCart = await upsertCart(req.userId);

    shoppingCart.tickets = [];
    shoppingCart.merch = [];

    const updated = await shoppingCart.save();
    res.status(200).json(await updated.toUserResponse());
});