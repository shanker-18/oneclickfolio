// API Configuration
const isDevelopment = import.meta.env.MODE === 'development';
const isProduction = import.meta.env.PROD;

// Debug logging
console.log('Environment MODE:', import.meta.env.MODE);
console.log('Is Development:', isDevelopment);
console.log('Is Production:', isProduction);

// Use deployed API URL in production
export const API_BASE_URL = isProduction ? 'https://giri-portfolio-generator-f9kr7o05e-giris-projects-75c3dbe7.vercel.app' : 'http://localhost:5000';

console.log('Selected API_BASE_URL:', API_BASE_URL);

export default API_BASE_URL;
