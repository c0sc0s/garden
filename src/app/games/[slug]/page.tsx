import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GameMarkdown } from "@/components/game-markdown";
import { getGameArtwork, getGamePost, getGamePosts } from "@/lib/games";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getGamePosts()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getGamePost(slug);
  if (!post) notFound();
  return {
    title: post.title,
    description: post.description ?? `${post.game}通关手记。`,
    alternates: { canonical: `/games/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      images: post.cover
        ? [{ url: post.cover, alt: post.coverAlt ?? post.game }]
        : undefined,
    },
    robots: post.draft ? { index: false, follow: false } : undefined,
  };
}

export default async function GamePostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getGamePost(slug);
  if (!post) notFound();
  const artwork = await getGameArtwork(post.cover);
  const background = artwork
    ? ({
        "--game-art": `url("${artwork.background}")`,
        "--game-color-primary": artwork.primary,
        "--game-color-secondary": artwork.secondary,
      } as CSSProperties)
    : undefined;

  return (
    <div className="game-reading" style={background}>
      {artwork && <div className="game-atmosphere" aria-hidden="true" />}
      <Link href="/games" className="game-back">
        ← 通关手记
      </Link>
      <article className="game-article">
        <header className="game-article-heading">
          <div className="game-article-meta">
            <span>{post.game}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={post.date}>{post.date.replaceAll("-", ".")}</time>
            {post.draft && (
              <span className="game-draft">草稿 · 仅本地可见</span>
            )}
          </div>
          <h1>{post.title}</h1>
          {(post.platform || post.playtime) && (
            <div className="game-play-details">
              {post.platform && <span>{post.platform}</span>}
              {post.playtime && <span>{post.playtime}</span>}
            </div>
          )}
        </header>
        <GameMarkdown>{post.content}</GameMarkdown>
        <footer className="game-article-end">
          <Link href="/games">返回通关手记</Link>
        </footer>
      </article>
    </div>
  );
}
