import mongoose from "mongoose";

const institutionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["university", "institute"], required: true },
    country_id: { type: mongoose.Schema.Types.ObjectId, ref: "Country", required: true },
    country: { type: String, trim: true }, // لحفظ اسم الدولة إن أردت إظهارها بسهولة
    city: { type: String },
    image_url: { type: String, default: "" }, // سيخزن رابط Cloudinary
    description: { type: String },
    programs: [{ type: String }],
    admission_requirements: [{ type: String }],
    duration: { type: String },
    tuition_fees: { type: String },
    application_deadline: { type: String },
    language: { type: String },
    contact_phone: { type: String },
    website: { type: String },
    required_documents: [
      {
        name: { type: String },
        optional: { type: Boolean, default: false },
      },
    ],
    is_visible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Institution = mongoose.model("Institution", institutionSchema);

export default Institution;