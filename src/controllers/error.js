const { formatDevError, formatErrorProd } = require('../helpers/errorHandlers');
const { captureError } = require('../services/watchError');

function globalErrorHandler(
  error,
  req,
  res,
  // eslint-disable-next-line no-unused-vars
  next,
) {
  const statusCode = error.statusCode ?? 500;

  if (process.env.ENVIRONMENT === 'production') {
    captureError(error);
    return res.status(statusCode).json(formatErrorProd(error));
  }

  captureError(error);
  return res.status(statusCode).json(formatDevError(error));
}

module.exports = { globalErrorHandler };
