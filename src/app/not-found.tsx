import Link from "next/link";
export default function NotFound() {
  return (
    <section className="not-found">
      <h1 className="handwritten">A LITTLE LOST?</h1>
      <p>这一页还没有长出来。</p>
      <Link href="/">回到花园</Link>
    </section>
  );
}
