import type {RequestHandler} from "express";
import { verify } from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || 'SECRET_KEY';

export const authenticator:RequestHandler = function(req,res,next){
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
    const id = verify(token, SECRET_KEY);
    req.user = {
        id:id,
    };

    next();
};




