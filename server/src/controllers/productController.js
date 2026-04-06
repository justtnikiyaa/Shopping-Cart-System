import mongoose from "mongoose";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeProductInput = ({ name, description, price, image, category, stock }) => ({
  name: typeof name === "string" ? name.trim() : undefined,
  description: typeof description === "string" ? description.trim() : undefined,
  price: price === "" || price === undefined ? undefined : Number(price),
  image: typeof image === "string" ? image.trim() : undefined,
  category: typeof category === "string" ? category.trim() : category,
  stock: stock === "" || stock === undefined ? undefined : Number(stock)
});

const ensureValidObjectId = (value, fieldName) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new ApiError(`Invalid ${fieldName}`, 400);
  }
};

const validateCategoryExists = async (categoryId) => {
  ensureValidObjectId(categoryId, "category id");

  const exists = await Category.findById(categoryId).select("_id");

  if (!exists) {
    throw new ApiError("Category not found", 404);
  }
};

const createProduct = asyncHandler(async (req, res) => {
  const payload = normalizeProductInput(req.body);

  const requiredFields = [
    payload.name,
    payload.description,
    payload.price,
    payload.image,
    payload.category,
    payload.stock
  ];

  if (requiredFields.some((field) => field === undefined || field === null || field === "")) {
    throw new ApiError(
      "Name, description, price, image, category, and stock are required",
      400
    );
  }

  if (Number.isNaN(payload.price) || payload.price < 0) {
    throw new ApiError("Price must be a valid non-negative number", 400);
  }

  if (Number.isNaN(payload.stock) || payload.stock < 0) {
    throw new ApiError("Stock must be a valid non-negative number", 400);
  }

  await validateCategoryExists(payload.category);

  const product = await Product.create(payload);

  const populatedProduct = await Product.findById(product._id)
    .populate("category", "name")
    .lean();

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: {
      product: populatedProduct
    }
  });
});

const getProducts = asyncHandler(async (req, res) => {
  const { category, search, page = "1", limit = "9" } = req.query;
  const query = {};

  if (category) {
    ensureValidObjectId(category, "category filter");
    query.category = category;
  }

  if (search) {
    query.name = { $regex: escapeRegex(search), $options: "i" };
  }

  const parsedPage = Math.max(1, Number.parseInt(page, 10) || 1);
  const parsedLimit = Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 9));
  const skip = (parsedPage - 1) * parsedLimit;

  const [totalProducts, products] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query)
      .select("name description price image category stock createdAt")
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit)
      .lean()
  ]);

  const totalPages = Math.max(1, Math.ceil(totalProducts / parsedLimit));

  res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    data: {
      count: products.length,
      total: totalProducts,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        totalPages,
        hasNextPage: parsedPage < totalPages,
        hasPrevPage: parsedPage > 1
      },
      filters: {
        category: category || null,
        search: search || null
      },
      products
    }
  });
});

const getProductById = asyncHandler(async (req, res) => {
  ensureValidObjectId(req.params.id, "product id");

  const product = await Product.findById(req.params.id)
    .populate("category", "name")
    .lean();

  if (!product) {
    throw new ApiError("Product not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Product fetched successfully",
    data: {
      product
    }
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  ensureValidObjectId(req.params.id, "product id");

  const updates = normalizeProductInput(req.body);

  const hasAnyUpdate =
    updates.name !== undefined ||
    updates.description !== undefined ||
    updates.price !== undefined ||
    updates.image !== undefined ||
    updates.category !== undefined ||
    updates.stock !== undefined;

  if (!hasAnyUpdate) {
    throw new ApiError("At least one field is required to update product", 400);
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError("Product not found", 404);
  }

  if (updates.category !== undefined) {
    await validateCategoryExists(updates.category);
  }

  if (updates.price !== undefined && (Number.isNaN(updates.price) || updates.price < 0)) {
    throw new ApiError("Price must be a valid non-negative number", 400);
  }

  if (updates.stock !== undefined && (Number.isNaN(updates.stock) || updates.stock < 0)) {
    throw new ApiError("Stock must be a valid non-negative number", 400);
  }

  product.name = updates.name ?? product.name;
  product.description = updates.description ?? product.description;
  product.price = updates.price ?? product.price;
  product.image = updates.image ?? product.image;
  product.category = updates.category ?? product.category;
  product.stock = updates.stock ?? product.stock;

  const savedProduct = await product.save();
  const populatedProduct = await Product.findById(savedProduct._id)
    .populate("category", "name")
    .lean();

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: {
      product: populatedProduct
    }
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  ensureValidObjectId(req.params.id, "product id");

  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError("Product not found", 404);
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully"
  });
});

export { createProduct, deleteProduct, getProductById, getProducts, updateProduct };

