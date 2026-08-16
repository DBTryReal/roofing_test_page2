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
const gallery = defineCollection({
    loader: glob({
        base: "src/content/gallery",
        pattern: "*.md",
    }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            location: z.string(),
            category: z.enum([
                "roofing",
                "decks-porches",
                "gates-exteriors",
                "bathrooms-remodeling",
                "flooring-finishes",
                "painting",
            ]),
             // image() en lugar de z.string() activa la optimización de Astro:
             // resuelve la ruta relativa, verifica que el archivo existe,
             // y provee metadata (width, height) para <Image>
            image: image(),
             // Resto de fotos del proyecto (la portada es "image").
             // Se recorren en el lightbox de cada proyecto.
            images: z.array(z.object({
                image: image({ width: 1200, height: 900 }),
                alt: z.string(),
            })).default([]),
            alt: z.string(),
            featured: z.boolean().default(false),
            date: z.date().optional(),
            order: z.number().optional(),
         }),
});

export const collections = {
    pages,
    services,
    gallery
}
