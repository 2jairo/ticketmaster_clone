import { Schema, model } from 'mongoose';

interface IMerchCategory {
    title: string;
    slug: string;
    image: string;
}

const merchCategorySchema = new Schema<IMerchCategory>({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: String,
        default: 'https://static.productionready.io/images/smiley-cyrus.jpg',
    },
});

export const MerchCategoryModel = model<IMerchCategory>('MerchCategory', merchCategorySchema);
