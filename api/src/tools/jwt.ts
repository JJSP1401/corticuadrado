import jwt from 'jsonwebtoken';
import { UsersDocument } from '../models/users';

const generateToken = async (data:UsersDocument) : Promise<string> =>{
    try {
        if(!process.env.JWT_SECRET){
            throw new Error("Secret to create the token, doesn't exist")
        }
        return await jwt.sign(JSON.parse(JSON.stringify(data)), process.env.JWT_SECRET, {audience: process.env.JWT_AUDIENCE});
    } catch (error:unknown) {
        throw new Error(error as string);
    }
}


export {
    generateToken
}