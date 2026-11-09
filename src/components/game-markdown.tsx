import ReactMarkdown from "react-markdown";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import { remarkSpoilers } from "@/lib/remark-spoilers";

export function GameMarkdown({ children }: { children: string }) {
  return (
    <div className="prose game-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkDirective, remarkSpoilers]}
        components={{
          img: ({ src, alt, title }) => (
            // Markdown images can have arbitrary dimensions and remote sources.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={alt ?? ""}
              title={title}
              loading="lazy"
              decoding="async"
            />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
