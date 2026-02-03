const foodModel = require('../models/food.model');
const storageService = require('../services/storage.service');
const likeModel = require("../models/like.model");
const saveModel = require("../models/save.model");
const { v4: uuid } = require("uuid");
const { Readable } = require("stream");

const MAX_PAGE_SIZE = 20;

const buildStreamUrl = (req, foodId) => `${req.protocol}://${req.get("host")}/api/food/stream/${foodId}`;


async function createFood(req, res) {
    const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid())

    const foodItem = await foodModel.create({
        name: req.body.name,
        description: req.body.description,
        video: fileUploadResult.url,
        foodPartner: req.foodPartner._id
    })

    res.status(201).json({
        message: "food created successfully",
        food: foodItem
    })

}

async function getFoodItems(req, res) {
    const limit = Math.min(parseInt(req.query.limit, 10) || 8, MAX_PAGE_SIZE);
    const cursor = req.query.cursor;
    const query = cursor ? { createdAt: { $lt: new Date(cursor) } } : {};

    const foodItems = await foodModel
        .find(query)
        .sort({ createdAt: -1 })
        .limit(limit + 1)
        .select("name video description likeCount savesCount foodPartner createdAt")
        .lean();

    const hasMore = foodItems.length > limit;
    const pagedItems = hasMore ? foodItems.slice(0, limit) : foodItems;
    const nextCursor = hasMore ? pagedItems[pagedItems.length - 1]?.createdAt?.toISOString() : null;

    const responseItems = pagedItems.map((item) => ({
        ...item,
        streamUrl: buildStreamUrl(req, item._id)
    }));

    res.setHeader("Cache-Control", "public, max-age=30, stale-while-revalidate=30");
    res.status(200).json({
        message: "Food items fetched successfully",
        foodItems: responseItems,
        nextCursor
    });
}

async function streamFoodVideo(req, res) {
    try {
        const foodItem = await foodModel.findById(req.params.id).select("video").lean();
        if (!foodItem?.video) {
            return res.status(404).json({ message: "Video not found" });
        }

        const range = req.headers.range;
        const headers = range ? { Range: range } : {};
        const upstream = await fetch(foodItem.video, { headers });

        if (!upstream.ok && upstream.status !== 206) {
            return res.status(upstream.status).end();
        }

        res.status(range ? 206 : 200);
        res.setHeader("Content-Type", upstream.headers.get("content-type") || "video/mp4");
        res.setHeader("Accept-Ranges", upstream.headers.get("accept-ranges") || "bytes");
        if (upstream.headers.get("content-length")) {
            res.setHeader("Content-Length", upstream.headers.get("content-length"));
        }
        if (upstream.headers.get("content-range")) {
            res.setHeader("Content-Range", upstream.headers.get("content-range"));
        }
        res.setHeader("Cache-Control", "public, max-age=86400, immutable");

        if (!upstream.body) {
            return res.end();
        }
        Readable.fromWeb(upstream.body).pipe(res);
    } catch (error) {
        res.status(500).json({ message: "Unable to stream video" });
    }
}


async function likeFood(req, res) {
    const { foodId } = req.body;
    const user = req.user;

    const isAlreadyLiked = await likeModel.findOne({
        user: user._id,
        food: foodId
    })

    if (isAlreadyLiked) {
        await likeModel.deleteOne({
            user: user._id,
            food: foodId
        })

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { likeCount: -1 }
        })

        return res.status(200).json({
            message: "Food unliked successfully"
        })
    }

    const like = await likeModel.create({
        user: user._id,
        food: foodId
    })

    await foodModel.findByIdAndUpdate(foodId, {
        $inc: { likeCount: 1 }
    })

    res.status(201).json({
        message: "Food liked successfully",
        like
    })

}

async function saveFood(req, res) {

    const { foodId } = req.body;
    const user = req.user;

    const isAlreadySaved = await saveModel.findOne({
        user: user._id,
        food: foodId
    })

    if (isAlreadySaved) {
        await saveModel.deleteOne({
            user: user._id,
            food: foodId
        })

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { savesCount: -1 }
        })

        return res.status(200).json({
            message: "Food unsaved successfully"
        })
    }

    const save = await saveModel.create({
        user: user._id,
        food: foodId
    })

    await foodModel.findByIdAndUpdate(foodId, {
        $inc: { savesCount: 1 }
    })

    res.status(201).json({
        message: "Food saved successfully",
        save
    })

}

async function getSaveFood(req, res) {

    const user = req.user;

    const savedFoods = await saveModel.find({ user: user._id }).populate('food');

    if (!savedFoods || savedFoods.length === 0) {
        return res.status(404).json({ message: "No saved foods found" });
    }

    const enriched = savedFoods.map((item) => {
        const food = item.food?.toObject ? item.food.toObject() : item.food
        return {
            ...item.toObject(),
            food: food ? { ...food, streamUrl: buildStreamUrl(req, food._id) } : food
        }
    })

    res.status(200).json({
        message: "Saved foods retrieved successfully",
        savedFoods: enriched
    });

}


module.exports = {
    createFood,
    getFoodItems,
    streamFoodVideo,
    likeFood,
    saveFood,
    getSaveFood
}
