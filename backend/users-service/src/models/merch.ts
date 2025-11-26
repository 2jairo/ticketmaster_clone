import { Schema, model, Types } from 'mongoose';

interface IMerch {
    title: string;
    slug: string;
    images: string[];
    description: string;
    categoryId: Types.ObjectId;
    stock: number;
    sold: number;
    price: number;
}
export interface IMerchMethods {
    toUserResponse: () => Promise<any>
    toConcertDetailsResponse: () => Promise<any>
}

const merchSchema = new Schema<IMerch>({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    images: {
        type: [String],
        default: [],
    },
    description: {
        type: String,
        default: '',
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'MerchCategory',
        required: true,
    },
    stock: {
        type: Number,
        default: 0,
    },
    sold: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        default: 0,
    },
});

merchSchema.methods.toUserResponse = async function() {
    return {
        id: this._id,
        title: this.title,
        slug: this.slug,
        images: this.images,
        stock: this.stock,
        sold: this.sold,
        price: this.price,
    }
}

merchSchema.methods.toConcertDetailsResponse = async function() {
    await this.populate('categoryId')

    return {
        title: this.title,
        slug: this.slug,
        images: this.images,
        description: this.description,
        category: {
            slug: this.categoryId.slug,
            image: this.categoryId.image,
            title: this.categoryId.title,
        },
        stock: this.stock,
        sold: this.sold,
        price: this.price
    }
}


export const MerchModel = model<IMerch & IMerchMethods>('Merch', merchSchema);
