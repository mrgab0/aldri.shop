"use server";

import dbConnect from "@/lib/db";
import { Post, IPost } from "@/lib/models/Post";
import { revalidatePath } from "next/cache";

const SEED_POSTS: Partial<IPost>[] = [
  {
    title: "Guía Definitiva: Cómo Maximizar tu Productividad con Plantillas de Notion Pro",
    slug: "guia-productividad-plantillas-notion-pro",
    excerpt: "Descubre cómo organizar proyectos, hábitos y finanzas personales utilizando sistemas modulares de Notion diseñados para alto rendimiento.",
    mainImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80",
    published: true,
    createdAt: new Date("2026-02-14T10:00:00Z"),
    content: `## Potencia tu Productividad con las Plantillas de Aldri Shop

En **Aldri Shop**, sabemos que un sistema de trabajo desorganizado cuesta tiempo valioso. Nuestras plantillas de Notion están construidas para eliminar el caos mental y estructurar tu día con claridad absoluta.

### ⚡ ¿Por qué usar sistemas Notion en lugar de apps dispersas?

1. **Centralización Total:** Conecta tareas, bases de datos de clientes, finanzas y seguimiento de hábitos en un solo panel de control.
2. **Personalización Ilimitada:** Adapta cada vista a tus necesidades exactas (Kanban, Calendario, Tablas y Galerías).
3. **Descarga Inmediata:** Al adquirir tu plantilla en Aldri Shop, recibes acceso instantáneo con videotutorial de duplicación y configuración paso a paso.

> **💡 Consejo Pro:** Empieza registrando tus 3 prioridades diarias cada mañana antes de revisar correos o notificaciones.`
  },
  {
    title: "Color Grading Cinematográfico: Secretos para Usar LUTs en tus Videos",
    slug: "color-grading-cinematografico-guia-luts",
    excerpt: "Aprende a transformar el estilo visual de tus videos con paquetes de LUTs profesionales compatibles con Premiere Pro, DaVinci Resolve y Final Cut.",
    mainImage: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&auto=format&fit=crop&q=80",
    published: true,
    createdAt: new Date("2026-02-20T12:00:00Z"),
    content: `## Eleva la Calidad Visual de tu Contenido Audiovisual

El color transmite emociones antes que las palabras. Un buen etalonaje o corrección de color diferencia una producción amateur de una pieza cinematográfica.

### 🎬 Consejos para Aplicar LUTs con Éxito

1. **Corrige la Exposición y Balance de Blancos Primero:** Antes de aplicar un LUT creativo, ajusta los niveles básicos de sombras, altas luces y temperatura de color.
2. **Controla la Intensidad:** En lugar de aplicar el LUT al 100%, pruébalo al 60%-80% para un resultado orgánico y natural.
3. **Licencia Comercial Incluida:** Todos los paquetes de LUTs de **Aldri Shop** incluyen derechos de uso comercial para videos de YouTube, publicidad y redes sociales.`
  },
  {
    title: "Envíos Internacionales: Cómo Rastrear tu Paquete en Tiempo Real con 17Track",
    slug: "envios-internacionales-rastreo-tiempo-real",
    excerpt: "Conoce el paso a paso del proceso logístico y cómo consultar en vivo la ubicación y estado de entrega de tus gadgets favoritos.",
    mainImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&auto=format&fit=crop&q=80",
    published: true,
    createdAt: new Date("2026-03-01T15:00:00Z"),
    content: `## Transparencia y Seguridad en Envíos Internacionales

En **Aldri Shop**, trabajamos con proveedores certificados y empresas transportistas globales para asegurar que cada producto físico llegue en perfecto estado.

### 📦 ¿Cómo funciona el seguimiento de tu orden?

- **Procesamiento y Control de Calidad (24-48h):** Cada artículo es verificado antes de su embalaje.
- **Asignación de Guía Internacional:** Te proporcionamos un número de tracking oficial compatible con 17Track, Yanwen, YunExpress o carriers locales (USPS / Correo local).
- **Rastreo en Tiempo Real:** Puedes ingresar a nuestra sección de **Rastreo** con tu ID de pedido para ver actualizaciones satelitales paso a paso.`
  }
];

export async function getPosts(options?: { publishedOnly?: boolean; limit?: number }) {
  try {
    await dbConnect();
    const query: any = {};
    if (options?.publishedOnly) {
      query.published = true;
    }

    const limit = options?.limit || 50;
    let posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    if (!posts || posts.length === 0) {
      // Si la colección está vacía en BD, insertamos automáticamente los posts semilla
      try {
        await Post.insertMany(SEED_POSTS);
        posts = await Post.find(query).sort({ createdAt: -1 }).limit(limit).lean();
      } catch (seedErr) {
        posts = SEED_POSTS as any;
      }
    }

    return { success: true, data: JSON.parse(JSON.stringify(posts || SEED_POSTS)) };
  } catch (error) {
    console.warn("Aviso de BD en getPosts, usando posts semilla:", error);
    return { success: true, data: JSON.parse(JSON.stringify(SEED_POSTS)) };
  }
}

export async function getPostBySlug(slug: string) {
  try {
    await dbConnect();
    let post = await Post.findOne({ slug }).lean();
    if (!post) {
      const fallback = SEED_POSTS.find((p) => p.slug === slug);
      if (fallback) {
        return { success: true, data: JSON.parse(JSON.stringify(fallback)) };
      }
      return { success: false, error: "Post no encontrado" };
    }
    return { success: true, data: JSON.parse(JSON.stringify(post)) };
  } catch (error) {
    console.warn("Aviso de BD en getPostBySlug, usando fallback:", error);
    const fallback = SEED_POSTS.find((p) => p.slug === slug);
    if (fallback) {
      return { success: true, data: JSON.parse(JSON.stringify(fallback)) };
    }
    return { success: false, error: "Error al buscar post" };
  }
}

export async function createPost(data: any) {
  await dbConnect();
  try {
    // Generar slug si no viene
    const slug = (data.slug || data.title || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const newPost = await Post.create({
      title: data.title,
      slug: slug || `post-${Date.now()}`,
      content: data.content,
      excerpt: data.excerpt || (data.content ? data.content.slice(0, 160) : ""),
      mainImage: data.mainImage || "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=1200&auto=format&fit=crop&q=80",
      published: data.published !== false,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
    });

    revalidatePath("/nosotros");
    revalidatePath("/admin/blog");
    return { success: true, data: JSON.parse(JSON.stringify(newPost)) };
  } catch (error: any) {
    console.error("Error al crear post:", error);
    return { success: false, error: error.message || "Error al crear el post" };
  }
}

export async function updatePost(id: string, data: any) {
  await dbConnect();
  try {
    if (data.title && !data.slug) {
      data.slug = data.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    const updated = await Post.findByIdAndUpdate(id, data, { new: true });
    revalidatePath("/nosotros");
    revalidatePath("/admin/blog");
    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error: any) {
    console.error("Error al actualizar post:", error);
    return { success: false, error: error.message || "Error al actualizar post" };
  }
}

export async function deletePost(id: string) {
  await dbConnect();
  try {
    await Post.findByIdAndDelete(id);
    revalidatePath("/nosotros");
    revalidatePath("/admin/blog");
    return { success: true };
  } catch (error: any) {
    console.error("Error al eliminar post:", error);
    return { success: false, error: error.message || "Error al eliminar post" };
  }
}
