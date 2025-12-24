/**
 * Application constants
 */

// API Endpoints
export const API_ENDPOINTS = {
  PRODUCTS: '/api/products',
  CATEGORIES: '/api/categories',
  ORDERS: '/api/orders',
  SHIPPING_COST: '/api/products/shipping-cost',
} as const;

// Order Status
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
} as const;

// User Roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  CUSTOMER: 'CUSTOMER',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
} as const;

// Product Sorting
export const PRODUCT_SORT = {
  NEWEST: 'createdAt',
  OLDEST: 'createdAt',
  PRICE_LOW: 'price',
  PRICE_HIGH: 'price',
  NAME_A_Z: 'name',
  NAME_Z_A: 'name',
  POPULAR: 'salesCount',
} as const;

// Sort Order
export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

// Shipping Couriers
export const COURIERS = {
  JNE: 'jne',
  TIKI: 'tiki',
  POS: 'pos',
} as const;

// Payment Methods
export const PAYMENT_METHODS = {
  BANK_TRANSFER: 'bank_transfer',
  E_WALLET: 'e_wallet',
  CREDIT_CARD: 'credit_card',
  COD: 'cod',
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
} as const;

// Validation Rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  DESCRIPTION_MAX_LENGTH: 1000,
  ADDRESS_MAX_LENGTH: 500,
  PHONE_LENGTH: 10,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  CART: 'dhinda-cart',
  USER: 'dhinda-user',
  THEME: 'dhinda-theme',
  LANGUAGE: 'dhinda-language',
} as const;

// Animation Durations
export const ANIMATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
} as const;

// Breakpoints
export const BREAKPOINTS = {
  MOBILE: 640,
  TABLET: 768,
  DESKTOP: 1024,
  LARGE: 1280,
  XLARGE: 1536,
} as const;

// Colors (for reference)
export const COLORS = {
  PRIMARY: '#f472b6',
  SECONDARY: '#ec4899',
  ACCENT: '#f9a8d4',
  DARK: '#be185d',
  LIGHT: '#fce7f3',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED: 'Field ini wajib diisi',
  INVALID_EMAIL: 'Format email tidak valid',
  INVALID_PHONE: 'Format nomor telepon tidak valid',
  PASSWORD_TOO_SHORT: `Password minimal ${VALIDATION.PASSWORD_MIN_LENGTH} karakter`,
  NAME_TOO_SHORT: `Nama minimal ${VALIDATION.NAME_MIN_LENGTH} karakter`,
  NAME_TOO_LONG: `Nama maksimal ${VALIDATION.NAME_MAX_LENGTH} karakter`,
  FILE_TOO_LARGE: `File terlalu besar. Maksimal ${FILE_UPLOAD.MAX_SIZE / 1024 / 1024}MB`,
  INVALID_FILE_TYPE: 'Tipe file tidak didukung',
  NETWORK_ERROR: 'Terjadi kesalahan jaringan',
  SERVER_ERROR: 'Terjadi kesalahan server',
  NOT_FOUND: 'Data tidak ditemukan',
  UNAUTHORIZED: 'Anda tidak memiliki akses',
  FORBIDDEN: 'Akses ditolak',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  PRODUCT_ADDED: 'Produk berhasil ditambahkan ke keranjang',
  PRODUCT_UPDATED: 'Produk berhasil diperbarui',
  PRODUCT_DELETED: 'Produk berhasil dihapus',
  ORDER_CREATED: 'Pesanan berhasil dibuat',
  ORDER_UPDATED: 'Pesanan berhasil diperbarui',
  ORDER_CANCELLED: 'Pesanan berhasil dibatalkan',
  PROFILE_UPDATED: 'Profil berhasil diperbarui',
  PASSWORD_CHANGED: 'Password berhasil diubah',
  DATA_SAVED: 'Data berhasil disimpan',
} as const;

// Regex Patterns
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^(\+62|62|0)[0-9]{9,13}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
} as const;

// Default Values
export const DEFAULTS = {
  AVATAR: '/img/default-avatar.png',
  PRODUCT_IMAGE: '/img/placeholder.png',
  LOGO: '/img/logo.png',
  FAVICON: '/favicon.ico',
  LANGUAGE: 'id',
  CURRENCY: 'IDR',
  TIMEZONE: 'Asia/Jakarta',
} as const;

// Social Media Links
export const SOCIAL_LINKS = {
  INSTAGRAM: 'https://instagram.com/dhindahijab',
  FACEBOOK: 'https://facebook.com/dhindahijab',
  YOUTUBE: 'https://youtube.com/@dhindahijab',
  TIKTOK: 'https://tiktok.com/@dhindahijab',
} as const;

// Contact Information
export const CONTACT = {
  EMAIL: 'info@dhindahijab.com',
  PHONE: '+62 812-3456-7890',
  WHATSAPP: '+62 812-3456-7890',
  ADDRESS: 'Jakarta, Indonesia',
} as const;
