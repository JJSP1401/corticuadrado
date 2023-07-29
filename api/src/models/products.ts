import { Schema, model, Document } from 'mongoose';

export interface ProductDocument {
    _id: string;
    name: string;
    sku: string;
    description: string;
    price: number;
    created_at: number;
}

const productSchema = new Schema<ProductDocument>({
    name: {
        type: String,
        required: true
    },
    sku: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: { 
        type: Number,
        required: true
    },
    created_at: { 
        type: Number,
        default: Date.now
    }
});

export const ProductsModel = model<ProductDocument>("products", productSchema);
