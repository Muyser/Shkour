import mongoose from "mongoose";

const programSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    institution_id: { type: mongoose.Schema.Types.ObjectId, ref: "Institution", required: true }, 
    degree: { type: String, trim: true }, // مثل: بكالوريوس، ماجستير، دبلوم
    description: { type: String, trim: true },
    tuition_fees: { type: String },
    duration: { type: String },
    language: { type: String },
    is_visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Program = mongoose.model("Program", programSchema);

export default Program;