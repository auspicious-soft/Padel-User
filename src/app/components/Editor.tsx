"use client";
import { Editor } from '@tinymce/tinymce-react';
import React, { useRef, useState, useEffect } from 'react';
import { Editor as TinyMCEEditor } from 'tinymce';

interface TextEditorProps {
  value?: string;
  setDescription: (content: string) => void;
}

const TextEditor = ({ value = "", setDescription }: TextEditorProps) => {
  console.log('value: ', value);
  const [isClient, setIsClient] = useState(false);
  const editorRef = useRef<TinyMCEEditor | null>(null);

  // Client-side rendering check
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Simple direct handler for editor changes
  const handleEditorChange = (content: string) => {
    setDescription(content);
  };

  if (!isClient) {
    return null;
  }

  return (
    <Editor
      apiKey="i3y7w8pix5hu1az8npcsfq12hpoad2fwmncoil6vh40brkif"
      value={value}
      onInit={(evt, editor) => {
        editorRef.current = editor;
      }}
      init={{
        skin: "oxide-dark",
        // content_css: "dark",
        height: 250,
        menubar: false,
        statusbar: false,
        // plugins: 'table link autolink',
        toolbar: 'fontfamily fontsizeinput blocks forecolor bold italic underline alignleft aligncenter alignright undo redo | link | table',
        toolbar_location: 'top',
        font_family_formats:
          'Normal=arial,helvetica,sans-serif;' +
          'Sans Serif=sans-serif;' +
          'Serif=serif;' +
          'Monospace=monospace',
        content_style: `
          body { 
            font-family: arial,helvetica,sans-serif;
            font-size: 14px;
            margin: 0;
            padding: 16px;
             background-color: #000;
    color: #fff;
          }
          table {
            border-collapse: collapse;
            width: 100%;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
          }
          th {
            background-color: #f2f2f2;
          }
        `,
        browser_spellcheck: true,
      }}
      onEditorChange={handleEditorChange}
    />
  );
};

export default TextEditor;