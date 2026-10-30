import Faq from "../models/Faq.js";

// @desc    الحصول على جميع الأسئلة الشائعة مع البحث
// @route   GET /api/faqs
export const getFaqs = async (req, res) => {
  try {
    const { question, sort = "-createdAt", limit = 100 } = req.query;
    let query = {};

    if (question) query.question = { $regex: question, $options: "i" };

    const items = await Faq.find(query)
      .sort(sort)
      .limit(Number(limit));

    res.json({ items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    الحصول على سؤال مفرد بواسطة الـ ID
// @route   GET /api/faqs/:id
export const getFaqById = async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: "السؤال غير موجود" });
    }
    res.json(faq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    إنشاء سؤال جديد (للمشرف فقط)
// @route   POST /api/faqs
export const createFaq = async (req, res) => {
  try {
    const faq = await Faq.create(req.body);
    res.status(201).json(faq);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    تحديث سؤال (للمشرف فقط)
// @route   PUT /api/faqs/:id
export const updateFaq = async (req, res) => {
  try {
    const faq = await Faq.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!faq) {
      return res.status(404).json({ message: "السؤال غير موجود" });
    }

    res.json(faq);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    حذف سؤال (للمشرف فقط)
// @route   DELETE /api/faqs/:id
export const deleteFaq = async (req, res) => {
  try {
    const faq = await Faq.findByIdAndDelete(req.params.id);

    if (!faq) {
      return res.status(404).json({ message: "السؤال غير موجود" });
    }

    res.json({ message: "تم حذف السؤال بنجاح" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};