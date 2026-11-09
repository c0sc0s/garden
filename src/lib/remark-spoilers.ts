import type { Root } from "mdast";
import type {} from "mdast-util-directive";
import { visit } from "unist-util-visit";

export function remarkSpoilers() {
  return (tree: Root) => {
    visit(tree, "containerDirective", (node) => {
      if (node.name !== "spoiler") return;
      const label = node.children[0];
      const summary =
        label?.type === "paragraph" && label.data?.directiveLabel
          ? node.children.shift()!
          : {
              type: "paragraph" as const,
              children: [{ type: "text" as const, value: "含剧透，点击展开" }],
            };
      summary.data = { hName: "summary" };
      node.data = {
        hName: "details",
        hProperties: { className: ["game-spoiler"] },
      };
      node.children.unshift(summary);
    });
  };
}
