import { ApiError } from "../utils/apiResponse.js";
import { Prisma } from "@prisma/client";

export const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      error = new ApiError(400, `Duplicate field value entered: ${err.meta?.target}`);
    } else {
      error = new ApiError(400, `Database error: ${err.message}`);
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    error = new ApiError(400, "Database validation error");
  }

  const response = {
    success: false,
    message: error.message,
    errors: error.errors.length > 0 ? error.errors : undefined,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  res.status(error.statusCode || 500).json(response);
};
