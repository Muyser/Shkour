import GalleryItem from "../models/GalleryItem.js";
import cloudinary from "../config/cloudinary.js";

// دالة مساعدة لرفع الملفات إلى Cloudinary
const uploadToCloudinary = (fileBuffer, folderName = "student-portal/gallery") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto", // يتعرف تلقائياً على الفيديو أو الصورة
        folder: folderName,
        chunk_size: 6000000,   // السماح برفع الملفات الكبيرة كالڤيديوهات على أجزاء
      },
      (error, result) => {
        if (error) {
          reject(new Error(error.message || "فشل رفع الملف إلى Cloudinary"));
        } else {
          resolve(result.secure_url);
        }
      }
    );

    stream.end(fileBuffer);
  });
};

// @desc    الحصول على جميع عناصر المعرض مع البحث حسب العنوان
// @route   GET /api/gallery
export const getGalleryItems = async (req, res) => {
  try {
    const { media_type, title, sort = "-createdAt", limit = 100 } = req.query;
    let query = {};

    if (media_type) query.media_type = media_type;
    if (title) query.title = { $regex: title, $options: "i" };

    const items = await GalleryItem.find(query)
      .sort(sort)
      .limit(Number(limit));

    res.json({ items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    الحصول على عنصر واحد بواسطة الـ ID
// @route   GET /api/gallery/:id
export const getGalleryItemById = async (req, res) => {
  try {
    const item = await GalleryItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "العنصر غير موجود" });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    إضافة عنصر جديد للمعرض مع رفع الملف
// @route   POST /api/gallery
export const createGalleryItem = async (req, res) => {
  try {
    let media_url = req.body.media_url || "";

    if (req.file) {
      // رفع الملف (صورة أو فيديو) عبر الـ Buffer
      media_url = await uploadToCloudinary(req.file.buffer, "student-portal/gallery");
    }

    const galleryItem = await GalleryItem.create({
      ...req.body,
      media_url,
    });

    res.status(201).json(galleryItem);
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    res.status(400).json({ message: error.message || "فشل رفع الملف" });
  }
};

// @desc    تحديث عنصر في المعرض مع إمكانية رفع ملف جديد
// @route   PUT /api/gallery/:id
export const updateGalleryItem = async (req, res) => {
  try {
    let updateData = { ...req.body };

    if (req.file) {
      updateData.media_url = await uploadToCloudinary(req.file.buffer, "student-portal/gallery");
    }

    const galleryItem = await GalleryItem.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!galleryItem) {
      return res.status(404).json({ message: "العنصر غير موجود" });
    }

    res.json(galleryItem);
  } catch (error) {
    console.error("Cloudinary Update Error:", error);
    res.status(400).json({ message: error.message || "فشل تحديث العنصر" });
  }
};

// @desc    حذف عنصر من المعرض
// @route   DELETE /api/gallery/:id
export const deleteGalleryItem = async (req, res) => {
  try {
    const galleryItem = await GalleryItem.findByIdAndDelete(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({ message: "العنصر غير موجود" });
    }

    res.json({ message: "تم حذف العنصر بنجاح" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};