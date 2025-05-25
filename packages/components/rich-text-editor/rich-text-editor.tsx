'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const RichTextEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (content: string) => void;
}) => {
  const [editorValue, setEditorValue] = useState(value || '');

  useEffect(() => {
    // Перевіряємо, що ми в браузері
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        document.querySelectorAll('.ql-editor').forEach((el, index) => {
          if (index > 0) el.remove();
        });
      }, 100);
    }
  }, []);

  return (
    <div className="relative">
      <ReactQuill
        theme="snow"
        value={editorValue}
        onChange={(content) => {
          setEditorValue(content);
          onChange(content);
        }}
        modules={{
          toolbar: [
            [{ font: [] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ size: ['small', 'false', 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ color: [] }, { background: [] }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ align: [] }],
            ['blockquote', 'code-block'],
            ['link', 'image', 'video'],
            ['clean'],
          ],
        }}
        placeholder="Напиши детальний опис товару..."
        className="bg-transparent border border-gray-700 text-white rounded-md"
        style={{
          minHeight: '250px',
        }}
      />
      <style>
        {`
          .ql-toolbar {
            background-color: transparent;
            border-color:#444;
          }
          .ql-container {
            background-color: transparent;
            border-color:#444;
            color:white;
          }
          .ql-picker {
            color:white!important;
          }
          .ql-editor {
            min-height: 200px;
          }
          .ql-snow {
            border-color:#444!important;
          }
          .ql-editor.ql-blank::before {
            color:#aaa !important;
          }
          .ql-picker-options {
            background-color: #333;
            color:white !important;
          }
          .ql-picker-item {
            color:white !important;
          }
          .ql-strole {
            stroke: white !important;
          }
        `}
      </style>
    </div>
  );
};

export default RichTextEditor;
