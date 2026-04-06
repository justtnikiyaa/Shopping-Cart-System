import { sanitizeValue } from "../utils/sanitize.js";

const requestSanitizer = (req, res, next) => {
  req.body = sanitizeValue(req.body);
  req.query = sanitizeValue(req.query);
  req.params = sanitizeValue(req.params);
  next();
};

export default requestSanitizer;
