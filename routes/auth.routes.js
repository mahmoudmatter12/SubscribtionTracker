import { Router } from "express";

const authRouter = Router();

authRouter.get("/sign-up", (req, res) => {
  res.send({ title: "Register route" });
});

authRouter.get("/sign-in", (req, res) => {
  res.send({ title: "Login route" });
});

authRouter.get("/sign-out", (req, res) => {
  res.send({ title: "Logout route" });
});

export default authRouter;