import { Router } from "express";
import multer from "multer";
import { uploadImage } from "../controllers/uploadController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import ApiError from "../utils/ApiError.js";

const router = Router();

const allowedMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif"
];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      cb(new ApiError("Only JPG, PNG, WEBP, GIF, or AVIF images are allowed", 400));
      return;
    }

    cb(null, true);
  }
});

router.post("/", protect, adminOnly, upload.single("image"), uploadImage);

export default router;
