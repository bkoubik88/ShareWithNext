import mongoose, { model, models } from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
    },
    mainImage: {
      type: String,
      required: true,
    },
    blurImage: {
      type: String,
    },
    lngLat: {
      type: [Object],
    },

    follower: {
      type: [String],
    },
    rating: {
      type: Number,
    },
    comments: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Product = models.Product || model("Product", ProductSchema);
export default Product;
