import Application from "../models/Application.js";
import Institution from "../models/Institution.js";

// 1. إنشاء طلب تقديم جديد (مع السماح بطلب واحد فقط للطالب بناءً على رقم الواتساب)
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

    // التحقق عما إذا كان الطالب قد قدم مسبقاً برقم الواتساب
    const existingApplication = await Application.findOne({ whatsapp });
    if (existingApplication) {
      return res.status(400).json({ 
        error: "لديك طلب تقديم مسجل مسبقاً بهذا الرقم. يمكنك متابعة حالة طلبك عبر رقم التتبع." 
      });
    }

    // التحقق من وجود المؤسسة وجلب متطلباتها
    const institution = await Institution.findById(institution_id);
    if (!institution) {
      return res.status(404).json({ error: "المؤسسة غير موجودة" });
    }

    // التحقق من المستندات الإلزامية الخاصة بالجامعة
    const requiredDocsList = (institution.required_documents || []).filter(doc => doc.required);
    for (const reqDoc of requiredDocsList) {
      const isUploaded = documents?.some(d => d.name === reqDoc.name && d.file_uri);
      if (!isUploaded) {
        return res.status(400).json({ 
          error: `المستند الإلزامي "${reqDoc.name}" مطلوب ولم يتم إرفاقه.` 
        });
      }
    }

    // توليد رقم تتبع فريد
    const tracking_code = "SHK-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000);

    // إنشاء الطلب (تم تعيين الحالة لتتطابق تماماً مع الـ Model العربي)
    const newApplication = await Application.create({
      student_name,
      nationality,
      gender,
      whatsapp,
      current_country,
      last_qualification,
      grade,
      program,
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

// 2. جلب جميع الطلبات (مع دعم الفلترة حسب الحالة أو البحث)
export const getApplications = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status && status !== "all") {
      query.status = status;
    }

    if (search) {
      query.student_name = { $regex: search, $options: "i" };
    }

    const items = await Application.find(query).sort({ createdAt: -1 });
    res.json({ items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. جلب طلب واحد بالتفصيل عبر الـ ID
export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: "الطلب غير موجود" });
    }
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. تحديث حالة الطلب والملاحظات الداخلية (للمشرفين)
export const updateApplication = async (req, res) => {
  try {
    const { status, admin_notes } = req.body;
    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      { status, admin_notes },
      { new: true, runValidators: true }
    );

    if (!updatedApplication) {
      return res.status(404).json({ error: "الطلب غير موجود" });
    }

    res.json(updatedApplication);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 5. حذف طلب
export const deleteApplication = async (req, res) => {
  try {
    const deleted = await Application.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "الطلب غير موجود" });
    }
    res.json({ message: "تم حذف الطلب بنجاح" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};