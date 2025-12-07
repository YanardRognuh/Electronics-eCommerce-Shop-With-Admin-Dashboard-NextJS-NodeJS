// lib/config.ts

const getApiBaseUrl = () => {
  // Check if we're running on the server (Node.js) or client (browser)
  const isServer = typeof window === "undefined";

  if (isServer) {
    // Server-side: Use internal Docker network
    // API_BASE_URL is for server-to-server communication
    return (
      process.env.API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "http://localhost:3001"
    );
  } else {
    // Client-side: Use public URL (browser can't resolve Docker container names)
    return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
  }
};

const config = {
  apiBaseUrl: getApiBaseUrl(),
  nextAuthUrl: process.env.NEXTAUTH_URL || "http://localhost:3000",
};

export default config;
