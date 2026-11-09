import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import remarkDirective from "remark-directive";
import { remarkSpoilers } from "../src/lib/remark-spoilers.ts";

function render(content) {
  return renderToStaticMarkup(
    createElement(
      ReactMarkdown,
      { remarkPlugins: [remarkDirective, remarkSpoilers] },
      content,
    ),
  );
}

test("spoilers are collapsed native details with a separate summary and Markdown body", () => {
  const html = render(
    "前文。\n\n:::spoiler[关于结局]\n**剧透正文**\n\n![插图](/images/game.png)\n:::\n\n后文。",
  );
  assert.match(
    html,
    /<details class="game-spoiler"><summary>关于结局<\/summary>/,
  );
  assert.match(html, /<strong>剧透正文<\/strong>/);
  assert.match(html, /<img src="\/images\/game.png"/);
  assert.match(html, /后文/);
  assert.doesNotMatch(html, /<details[^>]*\bopen\b/);
});

test("spoilers have a default label and cannot inject HTML attributes", () => {
  const html = render(
    ':::spoiler{onclick="alert(1)" open}\n正文\n:::\n\n<script>alert(1)</script>',
  );
  assert.match(html, /<summary>含剧透，点击展开<\/summary>/);
  assert.doesNotMatch(html, /<details[^>]*(onclick|open)/);
  assert.doesNotMatch(html, /<script>/);
});
