import Program from "../models/Program.js";

// @desc    الحصول على جميع التخصصات مع ربط بيانات المؤسسة والبحث
// @route   GET /api/programs
export const getPrograms = async (req, res) => {
  try {
    const { institution_id, name, sort = "order", limit = 100 } = req.query;
    let query = {};

    if (institution_id) query.institution_id = institution_id;
    if (name) query.name = { $regex: name, $options: "i" };

    const items = await Program.find(query)
      .populate("institution_id", "name type city")
      .sort(sort)
      .limit(Number(limit));

    res.json({ items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    الحصول على تخصص مفرد بواسطة الـ ID
// @route   GET /api/programs/:id
export const getProgramById = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id).populate("institution_id", "name type city");
    if (!program) {
      return res.status(404).json({ message: "التخصص غير موجود" });
    }
    res.json(program);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    إنشاء تخصص جديد (للمشرف فقط)
// @route   POST /api/programs
export const createProgram = async (req, res) => {
  try {
    const program = await Program.create(req.body);
    const populatedProgram = await Program.findById(program._id).populate("institution_id", "name type city");
    res.status(201).json(populatedProgram);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    تحديث تخصص (للمشرف فقط)
// @route   PUT /api/programs/:id
export const updateProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("institution_id", "name type city");

    if (!program) {
      return res.status(404).json({ message: "التخصص غير موجود" });
    }

    res.json(program);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    حذف تخصص (للمشرف فقط)
// @route   DELETE /api/programs/:id
export const deleteProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndDelete(req.params.id);

    if (!program) {
      return res.status(404).json({ message: "التخصص غير موجود" });
    }

    res.json({ message: "تم حذف التخصص بنجاح" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};