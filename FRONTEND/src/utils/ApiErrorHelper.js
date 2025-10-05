export const handleApiError = (error) => ({
  success: false,
  message: error.response?.data?.message || "An error occurred",
  errorCode: error.response?.data?.errorCode || "UNKNOWN_ERROR",
  data: {}
});
