import Application from "../models/Application.js";
import Institution from "../models/Institution.js";
import cloudinary from "../config/cloudinary.js";

// @desc    رفع ملف إلى Cloudinary مباشرة
// @route   POST /api/applications/upload
export const uploadFileToCloudinary = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "لم يتم إرفاق أي ملف." });
    }

    // رفع الملف باستخدام buffer الخاص بـ Multer
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" }, // ليتعامل مع الصور، الـ PDFs، أو الفيديوهات تلقائياً
      (error, result) => {
        if (error) {
          return res.status(500).json({ error: "فشل رفع الملف إلى السحابة: " + error.message });
        }
        res.status(200).json({
          message: "تم رفع الملف بنجاح",
          file_uri: result.secure_url, // الرابط الآمن من Cloudinary
          file_name: req.file.originalname,
        });
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    إنشاء طلب تقديم جديد (مع السماح بطلب واحد لكل واتساب لكل مؤسسة، والتحقق من المستندات الإلزامية)
// @route   POST /api/applications
export const createApplication = async (req, res) => {
  try {
    const {
      student_name,
      nationality,
      gender,
      whatsapp,
      current_country,
      last_qualification,
      grade,
      program,
      institution_id,
      documents,
    } = req.body;

    // 1. التحقق من وجود المؤسسة وجلب متطلباتها
    const institution = await Institution.findById(institution_id);
    if (!institution) {
      return res.status(404).json({ error: "المؤسسة غير موجودة" });
    }

    // 2. التحقق عما إذا كان الطالب قد قدم مسبقاً لنفس المؤسسة بنفس رقم الواتساب
    const existingApplication = await Application.findOne({ whatsapp, institution_id });
    if (existingApplication) {
      return res.status(400).json({ 
        error: "لديك طلب تقديم مسجل مسبقاً لهذه المؤسسة بهذا الرقم. يمكنك متابعة حالة طلبك عبر رقم التتبع." 
      });
    }

    // 3. التحقق من المستندات الإلزامية الخاصة بهذه المؤسسة فقط
    const requiredDocsList = (institution.required_documents || []).filter(doc => doc.required);
    for (const reqDoc of requiredDocsList) {
      const isUploaded = documents?.some(d => d.name === reqDoc.name && d.file_uri);
      if (!isUploaded) {
        return res.status(400).json({ 
          error: `المستند الإلزامي "${reqDoc.name}" مطلوب ولم يتم إرفاقه.` 
        });
      }
    }

    // 4. معالجة التخصص (تأكيد حفظه كنص بشكل آمن سواء وصل ككائن أو نص)
    const programValue = typeof program === "object" && program !== null ? program.name : program;

    // 5. توليد رقم تتبع فريد
    const tracking_code = "SHK-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000);

    // 6. إنشاء الطلب في قاعدة البيانات
    const newApplication = await Application.create({
      student_name,
      nationality,
      gender,
      whatsapp,
      current_country,
      last_qualification,
      grade,
      program: programValue,
      institution_id,
      documents: documents || [],
      tracking_code,
      status: "قيد الانتظار",
    });

    res.status(201).json({
      message: "تم إرسال الطلب بنجاح",
      tracking_code: newApplication.tracking_code,
      applicationId: newApplication._id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    جلب كافة الطلبات (للمشرفين)
export const getApplications = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status && status !== "all") {
      query.status = status;
    }

    if (search && search.trim() !== "") {
      query.student_name = { $regex: search.trim(), $options: "i" };
    }

    const applications = await Application.find(query)
      .populate("institution_id", "name type country city")
      .sort({ createdAt: -1 });

    // إرسال البيانات بالمفتاح items لتتطابق تماماً مع ما ينتظره الـ Frontend
    res.json({ items: applications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    جلب طلب محدد برقم الـ ID (للمشرفين)
export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate("institution_id");
    if (!application) {
      return res.status(404).json({ error: "الطلب غير موجود" });
    }
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    تحديث حالة الطلب (للمشرفين)
export const updateApplication = async (req, res) => {
  try {
    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedApplication) {
      return res.status(404).json({ error: "الطلب غير موجود" });
    }
    res.json(updatedApplication);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    حذف طلب (للمشرفين)
export const deleteApplication = async (req, res) => {
  try {
    const deletedApplication = await Application.findByIdAndDelete(req.params.id);
    if (!deletedApplication) {
      return res.status(404).json({ error: "الطلب غير موجود" });
    }
    res.json({ message: "تم حذف الطلب بنجاح" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};