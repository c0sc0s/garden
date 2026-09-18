import Image from "next/image";
import { site } from "@/lib/site";

export function SocialLinks() {
  return (
    <div className="social-links" role="group" aria-label="社交平台">
      {site.socials.map(({ name, icon, url }) => {
        const image = <Image src={icon} alt={name} width={36} height={36} draggable={false} />;
        return url ? (
          <a
            key={name}
            className="social-icon"
            draggable={false}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${name}（新窗口）`}
          >
            {image}
          </a>
        ) : (
          <span key={name} className="social-icon">
            {image}
          </span>
        );
      })}
      {site.instagram && (
        <a href={site.instagram} aria-label="Instagram">
          <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <rect x="5" y="5" width="22" height="22" rx="7" />
            <circle cx="16" cy="16" r="5" />
            <circle cx="23" cy="9" r="1" />
          </svg>
        </a>
      )}
      {site.email && (
        <a href={`mailto:${site.email}`} aria-label="发送邮件">
          <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <path d="M4 7 28 6 27 26 5 25 4 7Zm1 1 11 10L27 7" />
          </svg>
        </a>
      )}
    </div>
  );
}
