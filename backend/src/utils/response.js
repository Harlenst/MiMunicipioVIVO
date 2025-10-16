export const success = (res, message, data = null, code = 200) => {
  return res.status(code).json({
    success: true,
    message,
    data,
  });
};

export const failure = (res, message, code = 400, error = null) => {
  return res.status(code).json({
    success: false,
    message,
    error,
  });
};
