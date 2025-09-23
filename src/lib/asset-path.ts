const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Resolves local asset paths (from /public) to include the configured Next.js basePath.
 * External URLs (http/https) are returned unchanged.
 */
export const assetPath = (input: string): string => {
  if (!input) return input;
  if (/^(?:https?:)?\/\//.test(input)) {
    return input;
  }
  const normalized = input.startsWith("/") ? input : `/${input}`;
  if (!basePath) {
    return normalized;
  }
  if (normalized.startsWith(`${basePath}/`)) {
    return normalized;
  }
  return `${basePath}${normalized}`;
};
