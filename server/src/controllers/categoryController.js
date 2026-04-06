import mongoose from "mongoose";
import Category from "../models/Category.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const ensureValidObjectId = (value, fieldName) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new ApiError(`Invalid ${fieldName}`, 400);
  }
};

const normalizeCategoryInput = ({ name, description, image }) => ({
  name: name?.trim(),
  description: description?.trim(),
  image: image?.trim()
});

const createCategory = asyncHandler(async (req, res) => {
  const { name, description, image } = normalizeCategoryInput(req.body);

  if (!name || !description || !image) {
    throw new ApiError("Name, description, and image are required", 400);
  }

  const existingCategory = await Category.findOne({ name });

  if (existingCategory) {
    throw new ApiError("Category with this name already exists", 409);
  }

  const category = await Category.create({ name, description, image });

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: {
      category
    }
  });
});

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find()
    .select("name description image createdAt")
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    message: "Categories fetched successfully",
    data: {
      count: categories.length,
      categories
    }
  });
});

const getCategoryById = asyncHandler(async (req, res) => {
  ensureValidObjectId(req.params.id, "category id");

  const category = await Category.findById(req.params.id)
    .select("name description image createdAt updatedAt")
    .lean();

  if (!category) {
    throw new ApiError("Category not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Category fetched successfully",
    data: {
      category
    }
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  ensureValidObjectId(req.params.id, "category id");

  const updates = normalizeCategoryInput(req.body);

  if (!updates.name && !updates.description && !updates.image) {
    throw new ApiError("At least one field is required to update category", 400);
  }

  const category = await Category.findById(req.params.id);

  if (!category) {
    throw new ApiError("Category not found", 404);
  }

  if (updates.name && updates.name !== category.name) {
    const duplicate = await Category.findOne({ name: updates.name });

    if (duplicate) {
      throw new ApiError("Category with this name already exists", 409);
    }
  }

  category.name = updates.name ?? category.name;
  category.description = updates.description ?? category.description;
  category.image = updates.image ?? category.image;

  const savedCategory = await category.save();

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: {
      category: savedCategory
    }
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  ensureValidObjectId(req.params.id, "category id");

  const category = await Category.findById(req.params.id);

  if (!category) {
    throw new ApiError("Category not found", 404);
  }

  await category.deleteOne();

  res.status(200).json({
    success: true,
    message: "Category deleted successfully"
  });
});

export {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory
};
