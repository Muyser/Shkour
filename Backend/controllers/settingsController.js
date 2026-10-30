import SiteSettings from "../models/SiteSettings.js";

export const getSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = await SiteSettings.create({});
    res.json({ items: [settings] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (settings) {
      settings = await SiteSettings.findByIdAndUpdate(settings._id, req.body, { new: true });
    } else {
      settings = await SiteSettings.create(req.body);
    }
    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};