"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  type ReactNode,
} from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Underline as UnderlineIcon,
} from "lucide-react";
import type { TipTapDoc } from "@/lib/notes/types";
import { NoteViewer } from "@/components/notes/NoteViewer";
import { cn } from "@/lib/utils";

type NoteEditorProps = {
  initialContent?: TipTapDoc;
  onChange?: (content: TipTapDoc) => void;
  editorKey?: string;
};

export type NoteEditorHandle = {
  getContent: () => TipTapDoc;
};

const emptyDoc: TipTapDoc = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

function ToolbarButton({
  active,
  onClick,
  label,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "inline-flex h-10 w-10 shrink-0 items-center justify-center border border-transparent text-ink-300 transition-colors hover:text-ink-50 active:text-ink-50 sm:h-8 sm:w-8 touch-manipulation",
        active && "border-ink-600 bg-ink-700 text-ink-50"
      )}
    >
      {children}
    </button>
  );
}

export const NoteEditor = forwardRef<NoteEditorHandle, NoteEditorProps>(
  function NoteEditor({ initialContent, onChange, editorKey }, ref) {
    const [preview, setPreview] = useState(false);
    const [content, setContent] = useState<TipTapDoc>(initialContent ?? emptyDoc);

    const editor = useEditor(
      {
        extensions: [
          StarterKit,
          Underline,
          Link.configure({
            openOnClick: false,
            HTMLAttributes: {
              rel: "noopener noreferrer",
              target: "_blank",
            },
          }),
          TextAlign.configure({
            types: ["heading", "paragraph"],
          }),
          Image,
        ],
        content: initialContent ?? emptyDoc,
        immediatelyRender: false,
        onUpdate: ({ editor: current }) => {
          const json = current.getJSON() as TipTapDoc;
          setContent(json);
          onChange?.(json);
        },
        editorProps: {
          attributes: {
            class: "min-h-[320px] focus:outline-none",
          },
        },
      },
      [editorKey]
    );

    useImperativeHandle(
      ref,
      () => ({
        getContent: () => {
          if (editor) {
            return editor.getJSON() as TipTapDoc;
          }
          return content;
        },
      }),
      [editor, content]
    );

    useEffect(() => {
      if (!editor || !initialContent) return;
      const current = JSON.stringify(editor.getJSON());
      const next = JSON.stringify(initialContent);
      if (current !== next) {
        editor.commands.setContent(initialContent, { emitUpdate: false });
        setContent(initialContent);
        onChange?.(initialContent);
      }
    }, [editor, initialContent, onChange]);

    if (!editor) {
      return (
        <div className="border border-ink-600 bg-ink-800 px-4 py-8 text-sm text-ink-400">
          Loading editor...
        </div>
      );
    }

    function setLink() {
      const previous = editor?.getAttributes("link").href as string | undefined;
      const url = window.prompt("URL", previous || "https://");
      if (url === null) return;
      if (url === "") {
        editor?.chain().focus().extendMarkRange("link").unsetLink().run();
        return;
      }
      editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }

    function addImage() {
      const url = window.prompt("Image URL");
      if (!url) return;
      editor?.chain().focus().setImage({ src: url }).run();
    }

    return (
      <div className="space-y-3">
        <div className="flex flex-col gap-2 border border-ink-600 bg-ink-800 px-2 py-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3">
          <div className="toolbar-scroll flex max-w-full items-center gap-1 overflow-x-auto pb-0.5">
            <ToolbarButton
              label="Bold"
              active={editor.isActive("bold")}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold size={14} />
            </ToolbarButton>
            <ToolbarButton
              label="Italic"
              active={editor.isActive("italic")}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic size={14} />
            </ToolbarButton>
            <ToolbarButton
              label="Underline"
              active={editor.isActive("underline")}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              <UnderlineIcon size={14} />
            </ToolbarButton>
            <ToolbarButton
              label="Heading 2"
              active={editor.isActive("heading", { level: 2 })}
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
              <Heading2 size={14} />
            </ToolbarButton>
            <ToolbarButton
              label="Heading 3"
              active={editor.isActive("heading", { level: 3 })}
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            >
              <Heading3 size={14} />
            </ToolbarButton>
            <ToolbarButton
              label="Bullet list"
              active={editor.isActive("bulletList")}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <List size={14} />
            </ToolbarButton>
            <ToolbarButton
              label="Ordered list"
              active={editor.isActive("orderedList")}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <ListOrdered size={14} />
            </ToolbarButton>
            <ToolbarButton
              label="Blockquote"
              active={editor.isActive("blockquote")}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
              <Quote size={14} />
            </ToolbarButton>
            <ToolbarButton label="Link" active={editor.isActive("link")} onClick={setLink}>
              <Link2 size={14} />
            </ToolbarButton>
            <ToolbarButton label="Image" onClick={addImage}>
              <ImageIcon size={14} />
            </ToolbarButton>
            <ToolbarButton
              label="Align left"
              active={editor.isActive({ textAlign: "left" })}
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
            >
              <AlignLeft size={14} />
            </ToolbarButton>
            <ToolbarButton
              label="Align center"
              active={editor.isActive({ textAlign: "center" })}
              onClick={() => editor.chain().focus().setTextAlign("center").run()}
            >
              <AlignCenter size={14} />
            </ToolbarButton>
            <ToolbarButton
              label="Align right"
              active={editor.isActive({ textAlign: "right" })}
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
            >
              <AlignRight size={14} />
            </ToolbarButton>
          </div>

          <button
            type="button"
            onClick={() => setPreview((value) => !value)}
            className="admin-action self-start border-0 px-3 py-2 text-xs uppercase tracking-[0.16em] text-ink-300 hover:border-0 sm:self-auto"
          >
            {preview ? "Edit" : "Preview"}
          </button>
        </div>

        {preview ? (
          <div className="border border-ink-600 bg-ink-800 px-6 py-8">
            <NoteViewer content={editor.getJSON() as TipTapDoc} />
          </div>
        ) : (
          <div className="editor-surface border border-ink-600 bg-ink-800">
            <EditorContent editor={editor} />
          </div>
        )}
      </div>
    );
  }
);