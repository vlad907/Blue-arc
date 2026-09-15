/**
 * Admin UI and `/api/admin/*` routes are enabled in development, or in production
 * when `ENABLE_ADMIN_API=true` (requires a Node server — not compatible with `output: "export"`).
 */
export function isAdminApiEnabled(): boolean {
  if (process.env.NODE_ENV === "development") return true;
  return process.env.ENABLE_ADMIN_API === "true";
}
