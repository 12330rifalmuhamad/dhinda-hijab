/**
 * Error handling utilities
 */

import { ERROR_MESSAGES } from './constants';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(message, statusCode = 500, code = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
  }
}

/**
 * Custom error class for validation errors
 */
export class ValidationError extends Error {
  constructor(message, field = null) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.isOperational = true;
  }
}

/**
 * Handle API errors
 * @param {Error} error - Error object
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
export function handleApiError(error, req, res, next) {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      code: error.code,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }

  if (error instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      message: error.message,
      field: error.field,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }

  // Handle Prisma errors
  if (error.code === 'P2002') {
    return res.status(409).json({
      success: false,
      message: 'Data sudah ada dalam database',
      code: 'DUPLICATE_ENTRY'
    });
  }

  if (error.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'Data tidak ditemukan',
      code: 'NOT_FOUND'
    });
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token tidak valid',
      code: 'INVALID_TOKEN'
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token telah kedaluwarsa',
      code: 'TOKEN_EXPIRED'
    });
  }

  // Default error
  return res.status(500).json({
    success: false,
    message: ERROR_MESSAGES.SERVER_ERROR,
    ...(process.env.NODE_ENV === 'development' && { 
      error: error.message,
      stack: error.stack 
    })
  });
}

/**
 * Handle client-side errors
 * @param {Error} error - Error object
 * @param {Object} context - Error context
 */
export function handleClientError(error, context = {}) {
  console.error('Client Error:', error, context);

  // You can integrate with error reporting services here
  // e.g., Sentry, LogRocket, etc.

  return {
    message: error.message || ERROR_MESSAGES.NETWORK_ERROR,
    code: error.code || 'UNKNOWN_ERROR',
    context
  };
}

/**
 * Validate required fields
 * @param {Object} data - Data to validate
 * @param {Array} requiredFields - Array of required field names
 * @throws {ValidationError} If validation fails
 */
export function validateRequired(data, requiredFields) {
  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
      throw new ValidationError(`${field} is required`, field);
    }
  }
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @throws {ValidationError} If email is invalid
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError(ERROR_MESSAGES.INVALID_EMAIL, 'email');
  }
}

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @throws {ValidationError} If phone is invalid
 */
export function validatePhone(phone) {
  const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    throw new ValidationError(ERROR_MESSAGES.INVALID_PHONE, 'phone');
  }
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @throws {ValidationError} If password is weak
 */
export function validatePassword(password) {
  if (password.length < 8) {
    throw new ValidationError(ERROR_MESSAGES.PASSWORD_TOO_SHORT, 'password');
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new ValidationError(
      'Password harus mengandung huruf besar, huruf kecil, dan angka',
      'password'
    );
  }
}

/**
 * Validate file upload
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @throws {ValidationError} If file is invalid
 */
export function validateFile(file, options = {}) {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp']
  } = options;

  if (file.size > maxSize) {
    throw new ValidationError(ERROR_MESSAGES.FILE_TOO_LARGE, 'file');
  }

  if (!allowedTypes.includes(file.type)) {
    throw new ValidationError(ERROR_MESSAGES.INVALID_FILE_TYPE, 'file');
  }

  const extension = '.' + file.name.split('.').pop().toLowerCase();
  if (!allowedExtensions.includes(extension)) {
    throw new ValidationError(ERROR_MESSAGES.INVALID_FILE_TYPE, 'file');
  }
}

/**
 * Create error response
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {string} code - Error code
 * @returns {Object} Error response object
 */
export function createErrorResponse(message, statusCode = 500, code = null) {
  return {
    success: false,
    message,
    code,
    timestamp: new Date().toISOString()
  };
}

/**
 * Create success response
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code
 * @returns {Object} Success response object
 */
export function createSuccessResponse(data = null, message = null, statusCode = 200) {
  const response = {
    success: true,
    timestamp: new Date().toISOString()
  };

  if (data !== null) response.data = data;
  if (message) response.message = message;

  return response;
}

/**
 * Async error handler wrapper
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Wrapped function
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise} Promise that resolves with function result
 */
export async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (i === maxRetries - 1) {
        throw lastError;
      }

      const delay = baseDelay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
