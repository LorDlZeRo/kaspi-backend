import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: Object,
    price: Number,
    photo: Array,
    characteristics: Array,
    category_id: String,

})

export default productsSchema