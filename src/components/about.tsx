import Image from "next/image";
import { site } from "@/lib/site";
import { AboutHeading } from "./about-heading";
import { TikTokIcon } from "./tiktok-icon";
export function About() {
  return (
    <section className="about-layout" aria-labelledby="about-title">
      <div className="portrait">
        <Image
          src={site.portrait}
          alt={site.portraitAlt}
          fill
          draggable={false}
          priority
          sizes="(max-width: 860px) 270px, (max-width: 1043px) 240px, (max-width: 1304px) 23vw, 300px"
        />
      </div>
      <div className="about-copy">
        <AboutHeading />
        <div className="bio">
          {site.about.map((text) => (
            <p key={text}>
              {text.split("TikTok").map((part, index) => (
                <span key={index}>
                  {index > 0 && (
                    <span className="inline-brand">
                      <TikTokIcon />
                      TikTok
                    </span>
                  )}
                  {part}
                </span>
              ))}
            </p>
          ))}
          {site.email && (
            <a className="contact" href={`mailto:${site.email}`}>
              Feel free to get in touch.
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
