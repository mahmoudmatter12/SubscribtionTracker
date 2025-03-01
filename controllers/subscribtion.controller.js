import Subscribtion from '../models/subscribtions.model.js';

export const createSubscribtion = async (req, res, next) => {
    try {
        // console.log("Request Body:", req.body); // Log the request body
        const subscription = await Subscribtion.create({
            ...req.body,
            userId: req.user._id,
        });
        res.status(201).json({ success: true, data: { subscription } });
    } catch (e) {
        next(e);
    }
};

export const getSubscribtions = async (req, res, next) => {
    try {
        const subscriptions = await Subscribtion.find();
        res.status(200).json({ success: true, data: { subscriptions } });
    } catch (e) {
        next(e);
    }
};

export const getSubscribtionsForUser = async (req, res, next) => {
    try {
        const subscriptions = await Subscribtion.find({ userId: req.params.id });
        res.status(200).json({ success: true, data: { subscriptions } });
    } catch (e) {
        next(e);
    }
};