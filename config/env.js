import { config } from "dotenv";

config(
    { path: process.env.NODE_ENV === "production" ? ".prod.env" : ".dev.env" }
);

export const {PORT,NODE_ENV} = process.env;