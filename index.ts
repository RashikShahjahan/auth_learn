import { authenticator } from "./middleware/middleware";
import type { Request, Response } from 'express';
import { sign } from "jsonwebtoken";

const express = require('express');
const app = express();
const SECRET_KEY = process.env.SECRET_KEY || 'SECRET_KEY';
const fs = require('fs');
const cors = require('cors');
const usersObj = JSON.parse(fs.readFileSync('./users.json'));

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


  
const generateToken = async (id:string) => {
    const token = sign(id,SECRET_KEY);
    return token;
};


app.post('/login',async(req:Request,res:Response)=>{
    const {name,password} = req.body;
    console.log(name,password);
    const userObj = Object.entries(usersObj).find(([,user]) => user.name === name);
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

app.post('/changeName', authenticator, (req:Request,res:Response)=>{
    const id = req.body.user["id"];
    console.log(id);
    console.log(usersObj);

    usersObj[id].name = req.body.user.name;   
    fs.writeFileSync('./users.json',JSON.stringify(usersObj, null, 2));
    res.status(200).json({"message":"Changed name to"+usersObj[id].name});
});



app.listen(3000);