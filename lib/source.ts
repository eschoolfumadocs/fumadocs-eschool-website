import { docs } from "fumadocs-mdx:collections/server";
import { loader, type InferPageType } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import * as LucideIcons from "lucide-react";
import { createElement } from "react";

// SOURCE UTAMA
export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
  icon(name) {
    if (name && name in LucideIcons) {
      return createElement(LucideIcons[name as keyof typeof LucideIcons] as any);
    }
  },
  i18n: {
    languages: ["en", "id"],
    defaultLanguage: "en",
    parser: "dir",
  },
});

export type DocsPage = InferPageType<typeof source>;

// ──────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS (FIXED & CLEAN)
// ──────────────────────────────────────────────────────────────────────────────

/**
 * FIX: Gunakan fungsi bawaan getPageTree(lang)
 * Ini otomatis mengembalikan tree yang benar untuk bahasa tsb secara type-safe.
 */
export function getTreeByLang(lang: "id" | "en") {
  return source.getPageTree(lang);
}

/**
 * Menghasilkan URL image untuk Open Graph (OG)
 */
export function getPageImage(page: DocsPage) {
  const segments = [...page.slugs, "image.png"];
  return {
    segments,
    url: `/og/docs/${segments.join("/")}`,
  };
}

/**
 * Mengambil teks bersih dari halaman
 */
export async function getLLMText(page: DocsPage) {
  const processed = await page.data.getText("processed");
  return `# ${page.data.title}\n\n${processed}`;
}
