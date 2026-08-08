/**
 * Input sanitization utilities to prevent XSS and injection attacks
 */

/**
 * Sanitize HTML content by removing potentially dangerous tags and attributes
 */
export function sanitizeHtml(input: string): string {
  if (!input) return '';

  let sanitized = input;

  // Remove script tags and their content
  sanitized = sanitized.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, '');

  // Remove iframe tags
  sanitized = sanitized.replace(/<iframe\b[^>]*>([\s\S]*?)<\/iframe>/gim, '');

  // Remove object tags
  sanitized = sanitized.replace(/<object\b[^>]*>([\s\S]*?)<\/object>/gim, '');

  // Remove embed tags
  sanitized = sanitized.replace(/<embed\b[^>]*>/gim, '');

  // Remove on* event handlers
  sanitized = sanitized.replace(
    /\s*on\w+\s*=\s*("[^"]*"|'[^']*'|[^"'>\s]+)/gim,
    '',
  );

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gim, '');

  return sanitized.trim();
}

/**
 * Sanitize user input by escaping special characters
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';

  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  const reg = /[&<>"'/]/g;
  return input.replace(reg, (match) => map[match]);
}

/**
 * Sanitize a username to only allow safe characters
 */
export function sanitizeUsername(username: string): string {
  if (!username) return '';

  // Only allow alphanumeric, underscores, and hyphens
  return username.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
}

/**
 * Validate and sanitize a wallet address
 */
export function sanitizeWalletAddress(address: string): string {
  if (!address) return '';

  // Remove whitespace and convert to lowercase for consistency
  return address.trim().toLowerCase();
}

/**
 * Sanitize URL parameters
 */
export function sanitizeUrlParam(param: string): string {
  if (!param) return '';

  // Remove potentially dangerous characters
  return param.replace(/[<>"'&]/g, '');
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
