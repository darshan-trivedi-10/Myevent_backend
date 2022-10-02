import express from 'express';
import { createUser, loginUser, sendOtp } from '../Controller/userController.js';
const authRouter = express.Router(); 


authRouter.post('/verification', sendOtp);
authRouter.post('/signup', createUser); 
authRouter.post('/login', loginUser);

export default authRouter;