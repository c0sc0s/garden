import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { SocialLinks } from "@/components/social-links";
import { ImageDragGuard } from "@/components/image-drag-guard";
import { site } from "@/lib/site";
import "@fontsource-variable/inter";
import "@fontsource-variable/noto-sans-sc";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.author}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ImageDragGuard />
          <a className="skip-link" href="#main">
            跳到正文
          </a>
          <Header />
          <main id="main">{children}</main>
          <footer className="site-footer">
            <p>
              © {new Date().getFullYear()} {site.author}. 💓 with Dandan.
            </p>
            <SocialLinks />
          </footer>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
