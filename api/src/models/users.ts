import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export type UsersDocument = Document & {
    _id: string;
    name: string;
    email: string;
    administrator: boolean;
    shopping_history: Array<ShoppingHistory>;
    created_at: number;
}

export type ShoppingHistory = Document & {
    product_id: string;
    date_purchase: number;
    price: number;
    quantity: number;
}

const shoppingHistoySchema = new Schema({
    product_id: {
        type: String
    },
    date_purchase: {
        type: Number
    },
    price: {
        type: Number
    },
    quantity: {
        type: Number
    },
})

const userSchema = new Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    administrator: { 
        type: Boolean, 
        default: false 
    },
    shopping_history:[shoppingHistoySchema],
    created_at: { 
        type: Number, 
        default: Date.now 
    }
});

userSchema.pre('save', async function (next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
})

userSchema.methods.isValidPassword = async function(password: string | Buffer) {
    const compare = bcrypt.compare(password, this.password);
    return compare;
}

export const UsersModel = model<UsersDocument>("users", userSchema);
