import { authenticator } from "./middleware/middleware";
import type { Request, Response } from 'express';
import { sign } from "jsonwebtoken";

const express = require('express');
const app = express();
const router = express.Router()
const SECRET_KEY = process.env.SECRET_KEY || 'SECRET_KEY';

router.use(authenticator);
app.use(router);
app.use(express.json());

const users = {
    "1": {
      name: "John",
      password: "123456",
    },
    "2": {
      name: "Jane",
      password: "123456",
    },
  };
  
const generateToken = async (id:string) => {
    const token = sign(id,SECRET_KEY);
    return token;
};


app.post('/login',async(req:Request,res:Response)=>{
    const {name,password} = req.body;
    const userObj = Object.entries(users).find(([,user]) => user.name === name);
    const id = userObj? userObj[0]:undefined;
    const user = userObj? userObj[1]:undefined;

    if (!id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

    if(user && password === user.password){
        const token = await generateToken(id);
        res.status(200).json({"message":"Authenticated", "token":token});
    }
    else{
        res.status(401).json({ message: "Unauthorized" });
    }
});


router.get('/',async(req:Request,res:Response)=>{
    res.send(req.user);
});

app.listen(3000);