export interface ApiResponse<T = any> {
  status: "success" | "error";
  statusCode: number;
  message: string;
  data?: T;
  error?: string;
}

export function successResponse<T>(
  message: string,
  data?: T,
  statusCode: number = 200,
): ApiResponse<T> {
  return {
    status: "success",
    statusCode,
    message,
    data,
  };
}

export function errorResponse(
  message: string,
  error?: string,
  statusCode: number = 400,
): ApiResponse<never> {
  // Never leak internal error details (DB schema, stack traces) to clients in production
  const safeError =
    process.env.NODE_ENV === "production"
      ? undefined
      : error;

  return {
    status: "error",
    statusCode,
    message,
    error: safeError,
  };
}
