import { Router } from "express";
import { getSubscribtions, createSubscribtion, getSubscribtionsForUser } from "../controllers/subscribtion.controller.js";
import { authorize } from "../middleware/auth.middleware.js";

const subscribtionsRouter = Router();

// Get all subscriptions for the authenticated user
subscribtionsRouter.get("/",  getSubscribtions);

// Create a new subscription
subscribtionsRouter.post("/", createSubscribtion);

// get Subscribtions for a specific user
subscribtionsRouter.get("/user/:id",authorize, getSubscribtionsForUser);


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


subscribtionsRouter.put("/:id/cancel", (req, res) => {
    res.send({ title: "Cancel subscribtion" });
});

subscribtionsRouter.get("/upcomming-renewals", (req, res) => {
    res.send({ title: "Get all upcomming renewals" });
});

export default subscribtionsRouter;