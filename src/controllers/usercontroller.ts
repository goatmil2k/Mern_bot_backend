import User from "../models/user.js";
import { NextFunction, Request, Response } from "express";
import { hash, compare } from 'bcrypt';
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";

export const getAllUser = async (
    req: Request,
    res: Response,
    Next: NextFunction
) => {
    try {
        const users = await User.find().then();
        return res.status(200).json({ message: "Ok", users });
    } catch(err) {
        console.log(err);
        return res.json({message: "Error", cause: err.message});
    }
}

export const userSignUp = async (
    req: Request,
    res: Response,
    Next: NextFunction
) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(401).send("This user is already registered");
        const hashedPassword = await hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        //Create token and store cookie
        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            domain: 'localhost',
            signed: true,
            path: '/'
        });

        const token = createToken(user._id.toString(), user.email, '7d'); 
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, { path: '/', domain: 'localhost', expires, httpOnly: true, signed: true });
        return res.status(201).json({ message: "Ok", name: user.name, email: user.email });
    }
    catch(err) {
        console.log(err);
        return res.json({message: "Error", cause: err.message});
    }
    
}

export const userLogIn = async (
    req: Request,
    res: Response,
    Next: NextFunction
) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send("User is not registered");
        }
        const isPasswordCorrect = await compare(password, user.password);
        
        if (!isPasswordCorrect) {
            return res.status(403).send("Password is incorrect");
        }

        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            domain: 'localhost',
            signed: true,
            path: '/'
        });

        const token = createToken(user._id.toString(), user.email, '7d'); 
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, { path: '/', domain: 'localhost', expires, httpOnly: true, signed: true });
        console.log(user._id);
        return res.status(200).json({ message: "Ok", name: user.name, email: user.email });
    } 
    catch(error) {
        console.log(error)
        return res.json({message: "Error", cause: error.message});
    }
    
}

export const verifyUser = async (
    req: Request,
    res: Response,
    Next: NextFunction
) => {
    try {
        const localId = res.locals.jwtData.id;
        const user = await User.findById(localId);
        if (!user) {
            return res.status(401).send("User is not registered or token malfunctioned");
        }
        console.log(user._id.toString(), localId);
        if (user._id.toString() !== localId) {
            return res.status(401).send("Permission Denied");
        }

        return res.status(200).json({ message: "Ok", name: user.name, email: user.email });
    } catch(err) {
        console.log(err);
        return res.json({message: "Error", cause: err.message});
    }

}

export const logoutUser = async (
    req: Request,
    res: Response,
    Next: NextFunction
) => {
    try {
        const localId = res.locals.jwtData.id;
        const user = await User.findById(localId);
        if (!user) {
            return res.status(401).send("User is not registered or token malfunctioned");
        }
        if (user._id.toString() !== localId) {
            return res.status(401).send("Permission Denied");
        }

        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            domain: 'localhost',
            signed: true,
            path: '/'
        });

        return res.status(200).json({ message: "Ok"});
    } catch(err) {
        console.log(err);
        return res.json({message: "Error", cause: err.message});
    }

}