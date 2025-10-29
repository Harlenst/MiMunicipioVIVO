export const success = (res, message, data = {}, code = 200) => {
  return res.status(code).json({
    ok: true,
    message,
    data,
  });
};

export const failure = (res, message, code = 400, error = null) => {
  return res.status(code).json({
    ok: false,
    message,
    error,
  });
};
