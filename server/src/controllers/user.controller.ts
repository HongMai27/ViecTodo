import { Request, Response } from "express";
import User from "../models/user-model";
import bcrypt from "bcrypt";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import { IUser } from "../types";



const createUser = async (request: Request, response: Response) => {
    try {
        const { name, email, password } = request.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return response.status(409).send("User already exists");
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({ 
            name, 
            email, 
            password: hashedPassword });
            response.status(201).send({massage:"User created successfully"});
    } catch (error) {
       console.log("Error creating user", error);
       
    }
};
const getUserToken = (_id: string|Types.ObjectId) => {
    const authenticatedUserToken =  jwt.sign({ _id }, "express",{
        expiresIn: "7d"
    });
    return authenticatedUserToken;
}


const loginUser = async (request: Request, response: Response) => {
    try {
     const { email, password }: IUser = request.body
     const existingUser = await User.findOne({ email })
     if (!existingUser) {
        return response.status(409).send({ message: "User doesn't exist" })
      }
      const isPasswordIdentical = await bcrypt.compare(
        password,
        existingUser.password
      )

        if(isPasswordIdentical){
            const token = getUserToken(existingUser._id);
            return response.send(
                {
                    token,
                    user: {
                        name: existingUser.name,
                        email: existingUser.email
                    }
                }
            )
        } else {
            return response.status(400).send({message:"Invalid password"});
        }
    } catch (error) {
        console.log("Error logging in user", error);
    }
}



export { createUser,loginUser};