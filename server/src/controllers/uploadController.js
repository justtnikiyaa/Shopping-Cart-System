import cloudinary from "../config/cloudinary.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError("Image file is required", 400);
  }

  const base64File = req.file.buffer.toString("base64");
  const dataUri = `data:${req.file.mimetype};base64,${base64File}`;

  const uploadResult = await cloudinary.uploader.upload(dataUri, {
    folder: "shopcart",
    resource_type: "image"
  });

  res.status(200).json({
    success: true,
    message: "Image uploaded successfully",
    data: {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      originalName: req.file.originalname
    }
  });
});

export { uploadImage };
