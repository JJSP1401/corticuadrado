declare module Express {
    export interface Request {
        user?:User | null;
    }
    export interface User{
        _id: string;
        email: string;
        name: string;
        administrator: string;
    }
}