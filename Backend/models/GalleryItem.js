import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    media_type: { type: String, enum: ["image", "video"], default: "image" },
    media_url: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    is_visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const GalleryItem = mongoose.model("GalleryItem", gallerySchema);

export default GalleryItem;