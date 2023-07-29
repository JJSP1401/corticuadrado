import { Response, NextFunction, Request } from "express"
import { unauthorize } from './apiResponse';
import jwt from 'jsonwebtoken';
import { UsersModel } from "../models/users";
interface User {
    _id: string;
    email: string;
    name: string;
    administrator: string;
}
export default {
    verifyUser: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (req.headers.authorization) {
                try {
                    const user = await validateAnyUser(req.headers.authorization);
                    req.user = user;
                    next()
                } catch (error) {
                    return unauthorize(res, error.msg)
                }
            } else {
                return unauthorize(res, "Authorization field inexist")
            }
        } catch (error: unknown) {
            return unauthorize(res, "something went wrong in validation")
        }
    },
    verifyAdmin: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (req.headers.authorization) {
                try {
                    const user = await validateAnyUser(req.headers.authorization, true);
                    req.user = user;
                    next()
                } catch (error) {
                    return unauthorize(res, error.msg)
                }
            } else {
                return unauthorize(res, "Authorization field inexist")
            }
        } catch (error: unknown) {
            return unauthorize(res, "something went wrong in validation")
        }
    }
}

const validateAnyUser = async (auth: string, admin: boolean = false) => {
    interface QueryUser {
        _id: string,
        administrator?: boolean
    }
    return new Promise(async (resolve, reject) => {
        const token = auth.split(" ")[1]
        if (!token) {
            return reject({ msg: "Unauthorized" })
        }
        const data: User = await jwt.verify(token, process.env.JWT_SECRET || 'Key inexist')
        if (!data) {
            return reject({ msg: "Unauthorized" })
        }
        const query: QueryUser = {
            _id: data._id
        }
        if (admin) {
            query.administrator = true;
        }
        const user: User | null = await UsersModel.findOne(query);
        if (!user) {
            return reject({ msg: `${admin ? "Administrador" : "Usuario"} no encontrado` })
        }
        resolve(user);
    })
}