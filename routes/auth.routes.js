import { Router } from "express";
import { signUp } from "../controllers/auth.controller.js";

const authRouter = Router();

// authRouter.post("/sign-up", (req, res) => {
//   res.send({ title: "Register route" });
// });

authRouter.post("/sign-in", (req, res) => {
  res.send({ title: "Login route" });
});

authRouter.post("/sign-out", (req, res) => {
  res.send({ title: "Logout route" });
});

// here insted of making the logic in the same file we are using the controller file to make the logic
// and we are just importing the logic here and using it in the routes
// this is the best practice to make the code clean and readable
// and also we can use the same logic in different routes if we want to use it

authRouter.post("/sign-up", signUp);
// authRouter.post("/sign-in", signIn);
// authRouter.post("/sign-out", signOut);


export default authRouter;