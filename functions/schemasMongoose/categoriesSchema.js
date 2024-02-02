import mongoose, { Schema } from "mongoose";

const categoriesSchema = new mongoose.Schema({
    parent_id: Schema.Types.Mixed,
    name:String,
    level:Number,
})

export default categoriesSchema