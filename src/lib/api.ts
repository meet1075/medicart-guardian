export interface ApiResponse<T = any> {
  status: "success" | "error";
  code: number;
  message: string;
  data?: T;
  error?: string;
}

export function successResponse<T>(
  message: string,
  data?: T,
  code: number = 200,
): ApiResponse<T> {
  return {
    status: "success",
    code,
    message,
    data,
  };
}

export function errorResponse(
  message: string,
  error?: string,
  code: number = 400,
): ApiResponse<never> {
  return {
    status: "error",
    code,
    message,
    error,
  };
}
