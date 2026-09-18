import type { Metadata } from "next";
import { About } from "@/components/about";
export const metadata: Metadata = {
  title: "About me",
  alternates: { canonical: "/" },
};
export default function AboutPage() {
  return <About />;
}
