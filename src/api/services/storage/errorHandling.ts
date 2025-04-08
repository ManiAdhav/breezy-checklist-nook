
import { ApiResponse } from '../../types';

/**
 * Standardized error handler for service functions
 * @param error The caught error object
 * @param errorMessage User-friendly error message
 * @returns ApiResponse with error details
 */
export const handleServiceError = <T>(error: unknown, errorMessage: string): ApiResponse<T> => {
  console.error(errorMessage, error);
  return { success: false, error: errorMessage };
};
