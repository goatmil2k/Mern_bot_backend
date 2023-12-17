import { Router, Request, Response, NextFunction } from 'express';
import { getAllUser, logoutUser, userLogIn, userSignUp, verifyUser } from '../controllers/usercontroller.js';
import { validate, signUpValidator, logInValidator } from '../utils/validators.js';
import { verifyToken } from '../utils/token-manager.js';

const userRoute = Router();

userRoute.get('/', getAllUser);
userRoute.post('/signup', validate(signUpValidator), userSignUp);
userRoute.post('/login', validate(logInValidator), userLogIn);
userRoute.get('/auth-status', verifyToken, verifyUser);
userRoute.get('/logout', verifyToken, logoutUser);

export default userRoute;