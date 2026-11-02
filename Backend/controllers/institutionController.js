import Institution from "../models/Institution.js";
import Program from "../models/Program.js";
import cloudinary from "../config/cloudinary.js";

// دالة مساعدة لرفع الصور إلى Cloudinary
const uploadToCloudinary = (fileBuffer, folderName = "student-portal/institutions") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "image", folder: folderName },
      (error, result) => {
        if (error) reject(new Error(error.message || "فشل رفع الصورة"));
        else resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

// @desc    الحصول على جميع المؤسسات مع التصفية والبحث
// @route   GET /api/institutions
export const getInstitutions = async (req, res) => {
  try {
    const { country_id, type, name, sort = "-createdAt", limit = 100 } = req.query;
    let query = {};

    if (country_id) query.country_id = country_id;
    if (type) query.type = type;
    if (name) query.name = { $regex: name, $options: "i" };

    const items = await Institution.find(query)
      .sort(sort)
      .limit(Number(limit));

    res.json({ items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    الحصول على مؤسسة واحدة بواسطة ID مع تخصصاتها الخاصة فقط
// @route   GET /api/institutions/:id
export const getInstitutionById = async (req, res) => {
  try {
    const institution = await Institution.findById(req.params.id);
    if (!institution) {
      return res.status(404).json({ message: "المؤسسة غير موجودة" });
    }

    // جلب التخصصات التابعة لهذه المؤسسة المحددة فقط عبر institution_id
    const programs = await Program.find({ 
      institution_id: req.params.id, 
      is_visible: true 
    }).sort("order");

    res.json({
      ...institution.toObject(),
      programs: programs // مصفوفة تحتوي فقط على تخصصات هذه الجامعة/المعهد
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    إنشاء مؤسسة جديدة مع رفع الصورة
// @route   POST /api/institutions
export const createInstitution = async (req, res) => {
  try {
    let image_url = "";
    if (req.file) {
      image_url = await uploadToCloudinary(req.file.buffer);
    }

    let parsedData = { ...req.body, image_url };

    // تحليل المصفوفات المرسلة كنصوص في الـ FormData
    ["programs", "admission_requirements", "required_documents"].forEach((field) => {
      if (parsedData[field] && typeof parsedData[field] === "string") {
        try {
          parsedData[field] = JSON.parse(parsedData[field]);
        } catch {
          parsedData[field] = [];
        }
      }
    });

    const institution = await Institution.create(parsedData);
    res.status(201).json(institution);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    تحديث مؤسسة مع إمكانية رفع صورة جديدة
// @route   PUT /api/institutions/:id
export const updateInstitution = async (req, res) => {
  try {
    let updateData = { ...req.body };

    if (req.file) {
      updateData.image_url = await uploadToCloudinary(req.file.buffer);
    }

    ["programs", "admission_requirements", "required_documents"].forEach((field) => {
      if (updateData[field] && typeof updateData[field] === "string") {
        try {
          updateData[field] = JSON.parse(updateData[field]);
        } catch {
          updateData[field] = [];
        }
      }
    });

    const institution = await Institution.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!institution) {
      return res.status(404).json({ message: "المؤسسة غير موجودة" });
    }

    res.json(institution);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    حذف مؤسسة
// @route   DELETE /api/institutions/:id
export const deleteInstitution = async (req, res) => {
  try {
    const institution = await Institution.findByIdAndDelete(req.params.id);

    if (!institution) {
      return res.status(404).json({ message: "المؤسسة غير موجودة" });
    }

    res.json({ message: "تم حذف المؤسسة بنجاح" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};