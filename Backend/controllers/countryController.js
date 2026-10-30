import Country from "../models/Country.js";
import cloudinary from "../config/cloudinary.js";

// دالة مساعدة لرفع الصور إلى Cloudinary
const uploadToCloudinary = (fileBuffer, folderName = "student-portal/countries") => {
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

// @desc    الحصول على جميع الدول مع إمكانية البحث
// @route   GET /api/countries
export const getCountries = async (req, res) => {
  try {
    const { name, sort = "-createdAt", limit = 100 } = req.query;
    let query = {};

    if (name) query.name = { $regex: name, $options: "i" };

    const items = await Country.find(query)
      .sort(sort)
      .limit(Number(limit));

    res.json({ items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    الحصول على دولة واحدة بواسطة الـ ID
// @route   GET /api/countries/:id
export const getCountryById = async (req, res) => {
  try {
    const country = await Country.findById(req.params.id);
    if (!country) {
      return res.status(404).json({ message: "الدولة غير موجودة" });
    }
    res.json(country);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    إضافة دولة جديدة مع دعم رفع الصورة (للمشرف فقط)
// @route   POST /api/countries
export const createCountry = async (req, res) => {
  try {
    let image_url = "";
    if (req.file) {
      image_url = await uploadToCloudinary(req.file.buffer);
    }

    let highlights = req.body.highlights;
    if (typeof highlights === "string") {
      try {
        highlights = JSON.parse(highlights);
      } catch {
        highlights = highlights.split(",").map((h) => h.trim()).filter(Boolean);
      }
    }

    const countryData = {
      ...req.body,
      image_url,
      highlights: highlights || [],
    };

    const country = await Country.create(countryData);
    res.status(201).json(country);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    تحديث دولة مع إمكانية رفع صورة جديدة (للمشرف فقط)
// @route   PUT /api/countries/:id
export const updateCountry = async (req, res) => {
  try {
    let updateData = { ...req.body };

    if (req.file) {
      updateData.image_url = await uploadToCloudinary(req.file.buffer);
    }

    if (updateData.highlights && typeof updateData.highlights === "string") {
      try {
        updateData.highlights = JSON.parse(updateData.highlights);
      } catch {
        updateData.highlights = updateData.highlights.split(",").map((h) => h.trim()).filter(Boolean);
      }
    }

    const country = await Country.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!country) {
      return res.status(404).json({ message: "الدولة غير موجودة" });
    }

    res.json(country);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    حذف دولة (للمشرف فقط)
// @route   DELETE /api/countries/:id
export const deleteCountry = async (req, res) => {
  try {
    const country = await Country.findByIdAndDelete(req.params.id);

    if (!country) {
      return res.status(404).json({ message: "الدولة غير موجودة" });
    }

    res.json({ message: "تم حذف الدولة بنجاح" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};