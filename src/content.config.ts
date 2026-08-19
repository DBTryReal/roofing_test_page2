// ---
import { glob } from "astro/loaders"
import { defineCollection } from "astro:content"
import { z } from "astro/zod"

// ── Colección páginas únicas (about) ──────────────────────────────────
// Un solo .md → una sola página. Se usa getEntry() para cargarlo.
const pages = defineCollection({
    loader: glob({
        base: "src/content", // carpeta raíz de content/
        pattern: "*.md"      // solo los .md directos (no subcarpetas)
    }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        founding_year: z.number().optional(),
        team_size: z.number().optional(),
        location: z.string().optional()
    })
});

// ── Colección (services) ──────────────────────────────────────────────
// Múltiples .md → múltiples páginas. Se usa getCollection() + [id].astro.
const services = defineCollection({
    // loader: glob({ pattern: "**/[^_]*.md", base: "src/content/services" }),
    loader: glob({
        base: "src/content/services",
        pattern: "*.md"
    }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            tagline: z.string(),
            price: z.number(),
            // image() activa optimización de Astro (verifica el archivo y
            // provee width/height) para una futura portada de cada servicio.
            image: image().optional(),
            featured: z.boolean().default(false),
            icon: z.string(),
            order: z.number().optional() // para ordenar la lista
        })
});

// ── Colección (gallery) ─────────────────────────────────────────────────
// Un .md por proyecto, en subcarpetas por categoría:
//   src/content/gallery/<category>/project-001.md
// El conteo por categoría = número de .md de esa categoría. La portada de
// cada tarjeta es la primera imagen del array `images`.
const gallery = defineCollection({
    loader: glob({
        base: "src/content/gallery",
        pattern: "**/[^_]*.md",
    }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            location: z.string().optional(),
            category: z.enum([
                "roofing",
                "decks-porches",
                "gates-exteriors",
                "bathrooms-remodeling",
                "flooring-finishes",
                "painting",
            ]),
             // Todas las fotos del proyecto (la primera es la portada).
             // Se recorren en el lightbox de cada proyecto. image() resuelve
             // la ruta, verifica que el archivo existe y aporta width/height.
             images: z
                .array(
                    z.object({
                        image: image(),
                        alt: z.string(),
                    })
                )
                .min(1),
             featured: z.boolean().default(false),
             order: z.number().optional(),
          }),
});

export const collections = {
    pages,
    services,
    gallery
}
