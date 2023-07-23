import { Response, NextFunction, Request } from "express"
import { unauthorize } from './apiResponse';
import jwt from 'jsonwebtoken';
import { UsersModel } from "../models/users";
interface User{
    _id: string;
    email: string;
    name: string;
    administrator: string;
}
export default{
    verifyUser: async (req: Request, res: Response, next: NextFunction)=>{
        try {
            if(req.headers.authorization){
                const token = req.headers.authorization.split(" ")[1]
                if(!token){
                    return unauthorize(res, "Unauthorized")
                }
                const data:User = await jwt.verify(token, process.env.JWT_SECRET || 'Key inexist', {audience:process.env.JWT_AUDIENCE})
                if(!data){
                    return unauthorize(res, "Unauthorized")
                }
                const user:User | null = await UsersModel.findById(data._id);
                if(!user){
                    return unauthorize(res, "Teacher no found in DB")
                }
                req.user = user;
                next()
            }else{
                return unauthorize(res,"Authorization field inexist")
            }
        } catch (error:unknown) {
            return unauthorize(res,"something went wrong in validation")
        }
    }
}