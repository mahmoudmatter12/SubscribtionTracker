import { Router } from "express";
import { getUser, getUsers } from "../controllers/user.controller.js";
import { authorize } from "../middleware/auth.middleware.js";

const userRouter = Router();

// userRouter.get("/users", (req, res) => {
//     res.send({ title: "Get all user" });
// });

// userRouter.get("/:id", (req, res) => {
//     res.send({ title: "Get user detiels" });
// });

userRouter.get("/", getUsers);
userRouter.get("/:id", authorize, getUser);


userRouter.post("/", (req, res) => {
    res.send({
        title: "Create user"
    });
});

userRouter.put("/:id", (req, res) => {
    res.send({
        title: "Update user"
    });
});

userRouter.delete("/:id", (req, res) => {
    res.send({
        title: "Delete user"
    });
});

export default userRouter;