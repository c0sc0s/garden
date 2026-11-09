import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getGamePosts } from "@/lib/games";
import { formatDate } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Games",
  description: "玩过的游戏，和留在心里的那些事。",
  alternates: { canonical: "/games" },
};

export default async function Games() {
  const posts = await getGamePosts();
  return (
    <section className="games-page" aria-labelledby="games-title">
      <header className="games-heading">
        <p className="games-eyebrow">通关手记</p>
        <h1 className="handwritten" id="games-title">
          After the credits.
        </h1>
        <p>玩过的游戏，和留在心里的那些事。</p>
      </header>
      {posts.length ? (
        <div className="game-list">
          {posts.map((post) => (
            <article key={post.slug}>
              <Link
                className="game-preview"
                data-cover={Boolean(post.cover)}
                href={`/games/${post.slug}`}
              >
                <div className="game-preview-date">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  {post.draft && (
                    <span className="game-draft">草稿 · 仅本地可见</span>
                  )}
                </div>
                <div className="game-preview-copy">
                  <p className="game-preview-name">{post.game}</p>
                  <h2>{post.title}</h2>
                  {post.description && (
                    <p className="game-preview-summary">{post.description}</p>
                  )}
                </div>
                {post.cover && (
                  <div className="game-preview-cover">
                    <Image
                      src={post.cover}
                      alt={post.coverAlt ?? `${post.game}配图`}
                      fill
                      sizes="(max-width: 430px) calc(100vw - 44px), (max-width: 700px) 144px, 190px"
                    />
                  </div>
                )}
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <p className="games-empty">下一段旅程，慢慢写。</p>
      )}
    </section>
  );
}
