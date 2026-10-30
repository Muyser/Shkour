import Application from "../models/Application.js";
import Institution from "../models/Institution.js";
import Country from "../models/Country.js";
import Program from "../models/Program.js"; // أو استبدله حسب نموذج التخصصات لديك

// @desc    الحصول على إحصائيات لوحة التحكم وأحدث الطلبات
// @route   GET /api/dashboard/stats
export const getDashboardStats = async (req, res) => {
  try {
    // 1. حساب إحصائيات الطلبات
    const totalApplications = await Application.countDocuments();
    const newApplications = await Application.countDocuments({ status: "new" });
    const reviewingApplications = await Application.countDocuments({ status: "reviewing" });
    const acceptedApplications = await Application.countDocuments({ status: "accepted" });

    // 2. إحصائيات الكيانات الأخرى في الموقع
    const totalInstitutions = await Institution.countDocuments();
    const totalCountries = await Country.countDocuments();
    const totalPrograms = await Program.countDocuments(); // أو عدده بطريقتك المناسبة

    // 3. جلب أحدث 5 طلبات تقديم
    const recentApplications = await Application.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("student_name institution_name program status createdAt");

    // تنسيق البيانات لتتطابق تماماً مع ما تنتظره الواجهة الأمامية
    const stats = {
      applications: totalApplications,
      new: newApplications,
      reviewing: reviewingApplications,
      accepted: acceptedApplications,
      institutions: totalInstitutions,
      countries: totalCountries,
      programs: totalPrograms,
      services: 5, // يمكنك ربطها بنموذج الخدمات إن وجد، أو تركها ثابتة
    };

    const recent = recentApplications.map((app) => ({
      id: app._id,
      student_name: app.student_name,
      institution_name: app.institution_name,
      program: app.program,
      status: app.status,
      created_date: app.createdAt,
    }));

    res.json({
      stats,
      recent,
      notifications: [
        {
          id: "notif-1",
          title: "النظام يعمل بكفاءة",
          body: "تم ربط لوحة التحكم وقاعدة البيانات بنجاح.",
        },
      ],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};