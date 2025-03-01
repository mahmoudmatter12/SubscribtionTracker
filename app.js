import express from 'express';
import { PORT } from './config/env.js';
import authRouter from './routes/auth.routes.js';
import subscribtionsRouter from './routes/subscribtions.routes.js'; 
import userRouter from './routes/user.routes.js';
import ConnectToDatabase from './database/mangodb.js';
import errorMiddleware from './middleware/error.middleware.js';
import cookieParser from 'cookie-parser';

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(3000, async () => {
    console.log(`Subscribtion Tracker API is running on http://localhost:${PORT}`);
    await ConnectToDatabase();
});

app.use(errorMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/auth', authRouter);
app.use('/subscribtions', subscribtionsRouter);
app.use('/users', userRouter);


// to test that the app is running correctly, run the following command in the terminal:
// $ curl http://localhost:3000
// The response should be: Hello World!
// To test the auth routes, run the following command in the terminal:
// $ curl http://localhost:3000/auth/sign-up
// The response should be: {"title":"Register route"}


export default app;


