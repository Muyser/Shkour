import mongoose from "mongoose";

const countrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    flag: { type: String, trim: true },
    image_url: { type: String, default: "" },
    description: { type: String, trim: true },
    highlights: [{ type: String }],
    is_visible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Country", countrySchema);