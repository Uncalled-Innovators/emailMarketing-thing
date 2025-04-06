"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Button } from "./ui/button";
import { useState } from "react";

interface EmailEditorProps {
  onChange: (html: string) => void;
  content?: string;
}

export default function EmailEditor({ onChange, content }: EmailEditorProps) {
  const [imageUrl, setImageUrl] = useState("");

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const addImage = () => {
    if (!imageUrl) return;

    editor?.chain().focus().setImage({ src: imageUrl }).run();
    setImageUrl("");
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-md">
      <div className="border-b p-2 flex gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          data-active={editor.isActive("bold")}
        >
          Bold
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          data-active={editor.isActive("italic")}
        >
          Italic
        </Button>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="px-2 py-1 text-sm border rounded"
          />
          <Button variant="outline" size="sm" onClick={addImage}>
            Add Image
          </Button>
        </div>
      </div>
      <EditorContent
        editor={editor}
        className="p-4 min-h-[200px] prose max-w-none"
      />
    </div>
  );
}
