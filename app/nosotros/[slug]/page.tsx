import { getPostBySlug } from "@/lib/actions/post";
import { BlogPostDetail } from "@/components/shop/BlogPostDetail";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const res = await getPostBySlug(slug);

  if (!res.success || !res.data) {
    return {
      title: "Artículo no encontrado | Aldri Shop",
      description: "El artículo solicitado no fue encontrado en Aldri Shop."
    };
  }

  const post = res.data;

  return {
    title: `${post.title} | Aldri Shop`,
    description: post.excerpt || post.title,
    openGraph: {
      title: `${post.title} | Aldri Shop`,
      description: post.excerpt || post.title,
      type: "article",
      publishedTime: post.createdAt ? new Date(post.createdAt).toISOString() : undefined,
      images: [post.mainImage || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200"]
    }
  };
}

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await getPostBySlug(slug);

  if (!res.success || !res.data) {
    notFound();
  }

  return <BlogPostDetail post={res.data} locale="es" />;
}
