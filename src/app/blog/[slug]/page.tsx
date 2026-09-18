import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPosts, getPost, formatDate } from "@/lib/posts";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return getPosts().map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
    },
    robots: post.draft ? { index: false, follow: false } : undefined,
  };
}
export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  return (
    <article className="article-page">
      <Link className="back-link" href="/blog">
        ← Back to the journal
      </Link>
      <header className="article-heading">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        {post.draft && <p>草稿 · 仅本地可见</p>}
        <h1>{post.title}</h1>
        <p>{post.description}</p>
      </header>
      <div className="prose">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </div>
      <div className="article-end">
        <span className="handwritten">Thanks for reading.</span>
        <Link href="/blog">所有文章 ↗</Link>
      </div>
    </article>
  );
}
