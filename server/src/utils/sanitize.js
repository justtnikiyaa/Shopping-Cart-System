const rawFieldKeys = new Set(["password", "confirmPassword"]);

const stripControlChars = (value) => value.replace(/[\u0000-\u001F\u007F]/g, "");

const stripHtmlTags = (value) => value.replace(/<[^>]*>/g, "");

const sanitizeString = (value, key) => {
  let nextValue = stripControlChars(value);

  if (!rawFieldKeys.has(key)) {
    nextValue = stripHtmlTags(nextValue).trim();
  }

  return nextValue;
};

const sanitizeValue = (value, key = "") => {
  if (typeof value === "string") {
    return sanitizeString(value, key);
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item, key));
  }

  if (value && typeof value === "object") {
    return Object.entries(value).reduce((acc, [childKey, childValue]) => {
      acc[childKey] = sanitizeValue(childValue, childKey);
      return acc;
    }, {});
  }

  return value;
};

export { sanitizeValue };
