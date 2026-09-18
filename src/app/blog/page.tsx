import type { Metadata } from "next";
import Link from "next/link";
import { getPosts, formatDate } from "@/lib/posts";
export const metadata: Metadata = {
  title: "Blog",
  description: "日常、阅读和慢慢生长的想法。",
  alternates: { canonical: "/blog" },
};
export default function Blog() {
  const posts = getPosts();
  return (
    <section className="blog-page">
      <div className="page-heading">
        <h1 className="handwritten">THE JOURNAL</h1>
        <p>把生活里的小事，一篇一篇留下来。</p>
      </div>
      <div className="post-list">
        {posts.length ? (
          posts.map((post) => (
            <article key={post.slug} className="post-preview">
              <div className="post-date">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                {post.draft && <span>草稿 · 仅本地可见</span>}
              </div>
              <div>
                <h2>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p>{post.description}</p>
                <div className="post-bottom">
                  <span>{post.tags.join(" / ")}</span>
                  <Link
                    href={`/blog/${post.slug}`}
                    aria-label={`阅读 ${post.title}`}
                  >
                    Read the story ↗
                  </Link>
                </div>
              </div>
            </article>
          ))
        ) : (
          <p className="empty-state">故事还在生长，过些日子再来看看。</p>
        )}
      </div>
    </section>
  );
}
