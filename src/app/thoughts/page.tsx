import type { Metadata } from "next";
import { ThoughtGallery } from "@/components/thought-gallery";
import thoughts from "../../../content/thoughts.json";

type Thought = {
  id: string;
  date: string;
  text?: string;
  images?: { src: string; alt: string }[];
  animation?: "fish-blink";
};

export const metadata: Metadata = {
  title: "Thoughts",
  description: "一些随想，一两句话也值得留下。",
  alternates: { canonical: "/thoughts" },
};

export default function Thoughts() {
  const entries = [...(thoughts as Thought[])].sort(
    (a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id),
  );

  return (
    <section
      className="blog-page thoughts-page"
      aria-labelledby="thoughts-title"
    >
      <div className="page-heading">
        <h1 id="thoughts-title" className="handwritten">
          Thoughts
        </h1>
        <p>忽然想到了什么...</p>
      </div>
      {entries.length ? (
        entries.map((entry) => (
          <article className="thought-entry" key={entry.id}>
            <time dateTime={entry.date} className="thought-date">
              <span className="thought-date-main">
                {Number(entry.date.slice(5, 7))}月
                {Number(entry.date.slice(8, 10))}日
              </span>
              <span className="thought-date-year">
                {entry.date.slice(0, 4)}
              </span>
            </time>
            {entry.text && <p>{entry.text}</p>}
            {entry.animation === "fish-blink" && (
              <span
                className="fish-sprite thought-fish"
                role="img"
                aria-label="蓝色手绘小鱼眨眼动画"
              />
            )}
            {!!entry.images?.length && <ThoughtGallery images={entry.images} />}
          </article>
        ))
      ) : (
        <p className="thoughts-empty">想到什么，就在这里留下一句。</p>
      )}
    </section>
  );
}
