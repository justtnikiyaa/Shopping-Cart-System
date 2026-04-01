import ApiError from "../utils/ApiError.js";

const notFound = (req, res, next) => {
  next(new ApiError(`Route not found: ${req.originalUrl}`, 404));
};

export default notFound;
