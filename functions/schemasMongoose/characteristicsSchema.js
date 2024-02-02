import mongoose from "mongoose";

const characteristicsSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:String,
})

export default characteristicsSchema