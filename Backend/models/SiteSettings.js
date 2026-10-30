import mongoose from "mongoose";

const siteSettingsSchema = new mongoose.Schema({
  whatsapp_number: { type: String, default: "250794420606" },
  phone: { type: String, default: "" },
  email: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("SiteSettings", siteSettingsSchema);