import { config } from "dotenv";

config(
    { path: `.env.${process.env.NODE_ENV || 'dev'}.local` }
);

// console.log(`Environment: ${process.env.NODE_ENV}`);
// console.log(`Port: ${process.env.PORT}`);

export const { PORT,
    NODE_ENV,
    DB_URI,
    JWT_EXPIRE_IN,
    JWT_SECRET,
    ARCJET_KEY,
    ARCJET_ENV
} = process.env;