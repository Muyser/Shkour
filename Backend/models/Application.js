import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    // بيانات الطالب الشخصية
    student_name: { type: String, required: true },
    nationality: { type: String, required: true },
    gender: { type: String, enum: ["male", "female"], required: true },
    whatsapp: { type: String, required: true },
    current_country: { type: String, required: true },

    // البيانات الأكاديمية
    last_qualification: { type: String, required: true },
    grade: { type: String, required: true },
    program: { type: String, required: true },
    
    // الجامعة/المعهد المختار
    institution_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Institution", 
      required: true 
    },

    // المستندات المرفوعة المحددة للجامعة
    documents: [
      {
        name: { type: String, required: true },
        required: { type: Boolean, default: false },
        file_uri: { type: String, required: true },
        file_name: { type: String, required: true },
      }
    ],

    // كود تتبع الطلب الفريد
    tracking_code: { type: String, unique: true, required: true },

    // حالة الطلب باللغة العربية
    status: { 
      type: String, 
      enum: ["قيد الانتظار", "قيد المراجعة", "مقبول", "مرفوض"], 
      default: "قيد الانتظار" 
    },
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);