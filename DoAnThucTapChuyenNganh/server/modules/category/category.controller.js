const Cat = require("../../models/category.model");

// GET /categories
const getAllCats = async (req, res) => {
  try {
    const cats = await Cat.find();
    return res.status(200).json(cats);
  } catch (error) {
    console.error("Error in getAllCats:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// POST /categories
const createCat = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: "Title required" });
    const created = await Cat.create({ title });
    return res.status(201).json(created);
  } catch (error) {
    console.error("Error in createCat:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// PUT /categories/:id
const updateCat = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const updated = await Cat.findByIdAndUpdate(id, { title }, { new: true });
    if (!updated) return res.status(404).json({ message: "Not found" });
    return res.status(200).json(updated);
  } catch (error) {
    console.error("Error in updateCat:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// DELETE /categories/:id
const deleteCat = async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await Cat.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ message: "Not found" });
    return res.status(200).json({ message: "Deleted" });
  } catch (error) {
    console.error("Error in deleteCat:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

module.exports = { getAllCats, createCat, updateCat, deleteCat };
