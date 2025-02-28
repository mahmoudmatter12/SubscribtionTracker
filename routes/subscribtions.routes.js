import { Router } from "express";

const subscribtionsRouter = Router();

subscribtionsRouter.get("/subscribtions", (req, res) => {
    res.send({ title: "Get all subscribtions" });
});

subscribtionsRouter.get("/:id", (req, res) => {
    res.send({ title: "Get subscribtion detiels" });
});

subscribtionsRouter.post("/", (req, res) => {
    res.send({
        title: "Create subscribtion"
    });
});

subscribtionsRouter.put("/:id", (req, res) => {
    res.send({
        title: "Update subscribtion"
    });
});

subscribtionsRouter.delete("/:id", (req, res) => {
    res.send({
        title: "Delete subscribtion"
    });
});

export default subscribtionsRouter;