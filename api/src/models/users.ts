import { Schema, model, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';

export interface UsersDocument {
    _id: string;
    name: string;
    email: string;
    password: string;
    administrator: boolean;
    token?: string;
    deleted: boolean;
    isValidPassword: (password: string) => boolean;
    signin: () => void;
    shopping_history: Array<ShoppingHistory>;
    created_at: number;
}

export interface ShoppingHistory {
    product_id: string;
    date_purchase: number;
    price: number;
    quantity: number;
}

interface UserModel extends Model<UsersDocument> {
    findUserByEmail(email: string): UsersDocument;
}

const shoppingHistoySchema = new Schema<ShoppingHistory>({
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

const userSchema = new Schema<UsersDocument, UserModel>({
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
    deleted: {
        type: Boolean,
        default: false
    },
    shopping_history: [shoppingHistoySchema],
    created_at: {
        type: Number,
        default: Date.now
    }
});

userSchema.static('findUserByEmail', function (email: string) {
    return this.findOne({ email });
});

userSchema.pre('save', async function (next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
});

userSchema.methods.signin = function fn() {
    this.token = sign(
        {
            _id: this._id,
        },
        process.env.JWT_SECRET
    );
};

userSchema.methods.isValidPassword = async function (password: string | Buffer) {
    const compare = bcrypt.compare(password, this.password);
    return compare;
}

export const UsersModel = model<UsersDocument, UserModel>("users", userSchema);
