import express from 'express';
import { PORT } from './config/env.js';
import authRouter from './routes/auth.routes.js';

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(3000, () => {
    console.log(`Subscribtion Tracker API is running on http://localhost:${PORT}`);
});

app.use('/auth', authRouter);

// to test that the app is running correctly, run the following command in the terminal:
// $ curl http://localhost:3000
// The response should be: Hello World!
// To test the auth routes, run the following command in the terminal:
// $ curl http://localhost:3000/auth/sign-up
// The response should be: {"title":"Register route"}


export default app;


