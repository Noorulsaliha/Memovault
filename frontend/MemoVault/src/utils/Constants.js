export const BASE_URL = process.env.NODE_ENV === "development"
    ? "http://localhost:3000"   // Local development
    : "https://memovault.onrender.com"; // Production
