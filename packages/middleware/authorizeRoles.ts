
import { NextFunction, Response } from "express";
import { AuthError } from "../error-handler/index.js";

export const isSeller = (req:any, res:Response, next:NextFunction) => {
    if(req.role!=="seller"){
        return next(new AuthError("Unauthorized! You are not a seller."));
    }
    next();
};

export const isUser = (req:any, res:Response, next:NextFunction) => {
    if(req.role!=="user"){
        return next(new AuthError("Unauthorized! You are not a user."));
    }
    next();
};

export const isAdmin = (req:any, res:Response, next:NextFunction) => {
    if(req.role!=="admin"){
        return next(new AuthError("Unauthorized! You are not an admin."));
    }
    next();
};
