import type { CSSProperties, ReactNode } from "react";
import type { TipTapDoc, TipTapMark, TipTapNode } from "@/lib/notes/types";

function applyMarks(text: string, marks?: TipTapMark[]): ReactNode {
  if (!marks?.length) return text;

  return marks.reduce<ReactNode>((node, mark) => {
    switch (mark.type) {
      case "bold":
        return <strong>{node}</strong>;
      case "italic":
        return <em>{node}</em>;
      case "underline":
        return <u>{node}</u>;
      case "link": {
        const href = typeof mark.attrs?.href === "string" ? mark.attrs.href : "#";
        const target =
          typeof mark.attrs?.target === "string" ? mark.attrs.target : "_blank";
        return (
          <a href={href} target={target} rel="noopener noreferrer">
            {node}
          </a>
        );
      }
      default:
        return node;
    }
  }, text);
}

function alignmentStyle(attrs?: Record<string, unknown>): CSSProperties | undefined {
  const align = attrs?.textAlign;
  if (align === "left" || align === "center" || align === "right" || align === "justify") {
    return { textAlign: align };
  }
  return undefined;
}

function renderNode(node: TipTapNode, index: number): ReactNode {
  const key = `${node.type}-${index}`;

  switch (node.type) {
    case "doc":
      return <>{node.content?.map((child, i) => renderNode(child, i))}</>;
    case "paragraph":
      return (
        <p key={key} style={alignmentStyle(node.attrs)}>
          {node.content?.map((child, i) => renderNode(child, i)) || <br />}
        </p>
      );
    case "heading": {
      const level = Number(node.attrs?.level ?? 2);
      const children = node.content?.map((child, i) => renderNode(child, i));
      const style = alignmentStyle(node.attrs);
      if (level === 1) return <h1 key={key} style={style}>{children}</h1>;
      if (level === 3) return <h3 key={key} style={style}>{children}</h3>;
      return <h2 key={key} style={style}>{children}</h2>;
    }
    case "bulletList":
      return (
        <ul key={key}>
          {node.content?.map((child, i) => renderNode(child, i))}
        </ul>
      );
    case "orderedList":
      return (
        <ol key={key}>
          {node.content?.map((child, i) => renderNode(child, i))}
        </ol>
      );
    case "listItem":
      return (
        <li key={key}>
          {node.content?.map((child, i) => renderNode(child, i))}
        </li>
      );
    case "blockquote":
      return (
        <blockquote key={key}>
          {node.content?.map((child, i) => renderNode(child, i))}
        </blockquote>
      );
    case "hardBreak":
      return <br key={key} />;
    case "image": {
      const src = typeof node.attrs?.src === "string" ? node.attrs.src : "";
      const alt = typeof node.attrs?.alt === "string" ? node.attrs.alt : "";
      if (!src || src.startsWith("javascript:")) return null;
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={key} src={src} alt={alt} loading="lazy" />
      );
    }
    case "text":
      return (
        <span key={key}>{applyMarks(node.text ?? "", node.marks)}</span>
      );
    default:
      return (
        <div key={key}>
          {node.content?.map((child, i) => renderNode(child, i))}
        </div>
      );
  }
}

export function NoteViewer({ content }: { content: TipTapDoc }) {
  return <div className="prose-note">{renderNode(content, 0)}</div>;
}
