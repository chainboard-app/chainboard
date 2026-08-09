import { useState, useRef } from 'react';

interface RichTextEditorProps {
  value?: string;
  onChange: (content: string) => void;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
}

export function RichTextEditor({
  value = '',
  onChange,
  placeholder = 'Write something...',
  maxLength = 5000,
  disabled = false,
}: RichTextEditorProps) {
  const [content, setContent] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (maxLength && newValue.length > maxLength) return;
    setContent(newValue);
    onChange(newValue);
  };

  const insertFormat = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);
    
    setContent(newText);
    onChange(newText);
    
    textarea.focus();
    textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
  };

  const handleBold = () => insertFormat('**', '**');
  const handleItalic = () => insertFormat('*', '*');
  const handleUnderline = () => insertFormat('__', '__');
  const handleCode = () => insertFormat('`', '`');
  const handleLink = () => insertFormat('[', '](url)');

  return (
    <div className="rich-text-editor">
      <div className="toolbar">
        <button
          type="button"
          onClick={handleBold}
          disabled={disabled}
          className="toolbar-button"
          title="Bold"
        >
          <b>B</b>
        </button>
        <button
          type="button"
          onClick={handleItalic}
          disabled={disabled}
          className="toolbar-button"
          title="Italic"
        >
          <i>I</i>
        </button>
        <button
          type="button"
          onClick={handleUnderline}
          disabled={disabled}
          className="toolbar-button"
          title="Underline"
        >
          <u>U</u>
        </button>
        <button
          type="button"
          onClick={handleCode}
          disabled={disabled}
          className="toolbar-button"
          title="Code"
        >
          {'<>'}
        </button>
        <button
          type="button"
          onClick={handleLink}
          disabled={disabled}
          className="toolbar-button"
          title="Link"
        >
          🔗
        </button>
      </div>
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        className="editor-textarea"
      />
      <div className="character-count">
        {content.length} / {maxLength}
      </div>
    </div>
  );
}
