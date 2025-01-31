import path from "node:path";
import TanStackRouterVite from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), TanStackRouterVite({ autoCodeSplitting: true })],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
