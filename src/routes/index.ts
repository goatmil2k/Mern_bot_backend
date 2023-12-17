import { Router } from 'express';
import userRoute from './user-routes';
import chatRoute from './chat-routes';

const appRouter = Router();

appRouter.use('/user', userRoute);
appRouter.use('/chat', chatRoute);

export default appRouter;