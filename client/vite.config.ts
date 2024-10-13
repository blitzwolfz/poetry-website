import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Set base dynamically based on the environment
export default defineConfig({
  plugins: [react()],
  base: process.env.CUSTOM_DOMAIN === "true" ? "/" : "/poetry-website/", // Use "/" for custom domain, "/poetry-website/" for GitHub Pages
});
