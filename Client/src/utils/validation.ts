/**
 * Input Validation and Sanitization Utilities
 * Provides functions to validate and sanitize user inputs before sending to Firebase
 */

/**
 * Sanitizes a string input by:
 * 1. Trimming whitespace
 * 2. Removing potentially dangerous characters
 */
export const sanitizeString = (input: string): string => {
  if (!input) return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets to prevent XSS
    .replace(/[{}[\]]/g, '') // Remove braces and brackets
    .replace(/['"]/g, '') // Remove quotes
    .replace(/[&]/g, 'and') // Replace & with 'and'
    .substring(0, 200); // Limit length
};

/**
 * Sanitizes a name (first name, last name)
 */
export const sanitizeName = (name: string): string => {
  if (!name) return '';
  
  // Remove anything that's not a letter, space, hyphen, or apostrophe
  return name
    .trim()
    .replace(/[^a-zA-Z\s'-]/g, '')
    .replace(/\s+/g, ' ') // Multiple spaces to single space
    .substring(0, 50) // Limit length
    .trim();
};

/**
 * Validates email format
 */
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  
  const trimmedEmail = email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(trimmedEmail)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  if (trimmedEmail.length > 100) {
    return { isValid: false, error: 'Email address is too long' };
  }
  
  return { isValid: true };
};

/**
 * Validates password strength
 */
export const validatePassword = (password: string, isSignUp: boolean = false): { isValid: boolean; error?: string } => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (isSignUp) {
    if (password.length < 8) {
      return { isValid: false, error: 'Password must be at least 8 characters long' };
    }
    
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one uppercase letter' };
    }
    
    if (!/[a-z]/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one lowercase letter' };
    }
    
    if (!/[0-9]/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one number' };
    }
  }
  
  if (password.length > 128) {
    return { isValid: false, error: 'Password is too long' };
  }
  
  return { isValid: true };
};

/**
 * Validates and sanitizes phone number
 */
export const validatePhone = (phone: string): { isValid: boolean; error?: string; sanitized?: string } => {
  if (!phone) {
    return { isValid: true }; // Phone is optional
  }
  
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    return { isValid: false, error: 'Please enter a valid phone number' };
  }
  
  // Format phone number
  const sanitized = digitsOnly.substring(0, 15);
  
  return { isValid: true, sanitized };
};

/**
 * Validates name (first name or last name)
 */
export const validateName = (name: string, fieldName: string = 'Name'): { isValid: boolean; error?: string } => {
  if (!name) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  const sanitized = sanitizeName(name);
  
  if (sanitized.length < 1) {
    return { isValid: false, error: `${fieldName} cannot be empty` };
  }
  
  if (sanitized.length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters` };
  }
  
  if (sanitized.length > 50) {
    return { isValid: false, error: `${fieldName} must be less than 50 characters` };
  }
  
  // Check for valid name characters only
  if (!/^[a-zA-Z\s'-]+$/.test(sanitized)) {
    return { isValid: false, error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` };
  }
  
  return { isValid: true };
};

/**
 * Validates address
 */
export const validateAddress = (address: string): { isValid: boolean; error?: string } => {
  if (!address) {
    return { isValid: true }; // Address is optional
  }
  
  const trimmed = address.trim();
  
  if (trimmed.length < 5) {
    return { isValid: false, error: 'Address must be at least 5 characters' };
  }
  
  if (trimmed.length > 200) {
    return { isValid: false, error: 'Address must be less than 200 characters' };
  }
  
  return { isValid: true };
};

/**
 * Validates form data for registration
 */
export const validateRegistrationForm = (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  // Validate first name
  const firstNameValidation = validateName(firstName, 'First name');
  if (!firstNameValidation.isValid && firstNameValidation.error) {
    errors.firstName = firstNameValidation.error;
  }
  
  // Validate last name
  const lastNameValidation = validateName(lastName, 'Last name');
  if (!lastNameValidation.isValid && lastNameValidation.error) {
    errors.lastName = lastNameValidation.error;
  }
  
  // Validate email
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid && emailValidation.error) {
    errors.email = emailValidation.error;
  }
  
  // Validate password
  const passwordValidation = validatePassword(password, true);
  if (!passwordValidation.isValid && passwordValidation.error) {
    errors.password = passwordValidation.error;
  }
  
  // Validate confirm password
  if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validates profile form data
 */
export const validateProfileForm = (
  firstName: string,
  lastName: string,
  address: string,
  phoneNumber: string
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  // Validate first name
  const firstNameValidation = validateName(firstName, 'First name');
  if (!firstNameValidation.isValid && firstNameValidation.error) {
    errors.firstName = firstNameValidation.error;
  }
  
  // Validate last name
  const lastNameValidation = validateName(lastName, 'Last name');
  if (!lastNameValidation.isValid && lastNameValidation.error) {
    errors.lastName = lastNameValidation.error;
  }
  
  // Validate address
  const addressValidation = validateAddress(address);
  if (!addressValidation.isValid && addressValidation.error) {
    errors.address = addressValidation.error;
  }
  
  // Validate phone number
  const phoneValidation = validatePhone(phoneNumber);
  if (!phoneValidation.isValid && phoneValidation.error) {
    errors.phoneNumber = phoneValidation.error;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

