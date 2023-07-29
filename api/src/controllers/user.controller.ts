import { UsersModel } from "../models/users";
import { Request, Response } from 'express';
import { body, param, validationResult } from "express-validator";
import { badRequest, internalerror, success } from "../tools/apiResponse";
import { Types } from "mongoose";


export default {
    signIn: async (req:Request, res:Response) =>[
        body("email").exists().withMessage("Campo CORREO es requerido").custom(async value=>{
            const user = await UsersModel.findUserByEmail(value);
            if(!user) throw new Error("No encontramos usuario con el correo ingresado")
        }),
        body("password").exists().withMessage("Campo CONTRASEÑA es requerido"),
        async () => {
            try {
                const result = validationResult(req);
                if (!result.isEmpty()) {
                    return badRequest(res, "Error de validación", result.array());
                }

                const {email = "", password=""} = req.body;
                const user = await UsersModel.findOne({email,password});
                const token = user.signin();

                return success(res,"Logeo exitoso", {user, token})
            } catch (error) {
                return internalerror(res,"Hubo un error al crear el usuario", error)
            }
        }
    ],
    create: async (req:Request, res:Response) =>[
        body("name").exists().withMessage("Campo NOMBRE es requerido"),
        body("email").exists().withMessage("Campo CORREO es requerido").custom(async value=>{
            const user = await UsersModel.findUserByEmail(value);
            if(user) throw new Error("El correo ingresado ya esta en uso")
        }),
        body("password").exists().withMessage("Campo CONTRASEÑA es requerido"),
        async () => {
            try {
                const result = validationResult(req);
                if (!result.isEmpty()) {
                    return badRequest(res, "Error de validación", result.array());
                }

                const user = await UsersModel.create(req.body);
                const token = user.signin();

                return success(res,"Usuario creado con exito", {user, token})
            } catch (error) {
                return internalerror(res,"Hubo un error al crear el usuario", error)
            }
        }
    ],
    update: async (req:Request, res:Response) =>[
        param('id').customSanitizer(value => new Types.ObjectId(value)).withMessage("El id enviado no es valido"),
        async () => {
            try {
                const result = validationResult(req);
                if (!result.isEmpty()) {
                    return badRequest(res, "Error de validación", result.array());
                }

                const {id=""} = req.params;
                const userUpdated = await UsersModel.findByIdAndUpdate(id,{
                    $set:req.body
                })

                return success(res, "Usuario actualizado con exito", userUpdated)
            } catch (error) {
                return internalerror(res,"Hubo un error al actualizar el usuario", error)
            }
        }
    ],
    list: async (_req:Request, res:Response) =>[
        async () => {
            try {
                const users = await UsersModel.find();
                return success(res, "Usuarios encontrados:", users)
            } catch (error) {
                return internalerror(res,"Hubo un error al actualizar el usuario", error)
            }
        }
    ],
    delete: async (req:Request, res:Response) =>[
        param('id').customSanitizer(value => new Types.ObjectId(value)).withMessage("El id enviado no es valido"),
        async () => {
            try {
                const result = validationResult(req);
                if (!result.isEmpty()) {
                    return badRequest(res, "Error de validación", result.array());
                }

                const {id=""} = req.params;
                await UsersModel.findByIdAndUpdate(id,{
                    $set:{deleted:true}
                })
                
                return success(res,"Usuario eliminado")
            } catch (error) {
                return internalerror(res,"Hubo un error al actualizar el usuario", error)
            }
        }
    ],
}