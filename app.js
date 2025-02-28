import express from 'express';
import { PORT } from './config/env.js';

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(3000, () => {
    console.log(`Subscribtion Tracker API is running on http://localhost:${PORT}`);
});

export default app;


