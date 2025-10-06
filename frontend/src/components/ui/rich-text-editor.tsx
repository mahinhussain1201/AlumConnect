import React, { useEffect, useRef } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || ''
    }
  }, [value])

  const exec = (command: string, arg?: string) => {
    document.execCommand(command, false, arg)
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const insertImageByUrl = () => {
    const url = window.prompt('Enter image URL')
    if (url) exec('insertImage', url)
  }

  return (
    <div className="border rounded-lg bg-white">
      <div className="flex flex-wrap gap-2 p-2 border-b bg-gray-50">
        <button type="button" className="px-2 py-1 text-sm rounded hover:bg-gray-100" onClick={() => exec('bold')}>B</button>
        <button type="button" className="px-2 py-1 text-sm italic rounded hover:bg-gray-100" onClick={() => exec('italic')}>I</button>
        <button type="button" className="px-2 py-1 text-sm underline rounded hover:bg-gray-100" onClick={() => exec('underline')}>U</button>
        <button type="button" className="px-2 py-1 text-sm rounded hover:bg-gray-100" onClick={() => exec('formatBlock', '<h2>')}>H2</button>
        <button type="button" className="px-2 py-1 text-sm rounded hover:bg-gray-100" onClick={() => exec('formatBlock', '<h3>')}>H3</button>
        <button type="button" className="px-2 py-1 text-sm rounded hover:bg-gray-100" onClick={() => exec('insertUnorderedList')}>• List</button>
        <button type="button" className="px-2 py-1 text-sm rounded hover:bg-gray-100" onClick={() => exec('insertOrderedList')}>1. List</button>
        <button type="button" className="px-2 py-1 text-sm rounded hover:bg-gray-100" onClick={() => exec('formatBlock', '<blockquote>')}>Quote</button>
        <button type="button" className="px-2 py-1 text-sm rounded hover:bg-gray-100" onClick={() => exec('createLink', window.prompt('Enter URL') || '')}>Link</button>
        <button type="button" className="px-2 py-1 text-sm rounded hover:bg-gray-100" onClick={insertImageByUrl}>Image</button>
        <button type="button" className="px-2 py-1 text-sm rounded hover:bg-gray-100" onClick={() => exec('removeFormat')}>Clear</button>
      </div>
      <div
        ref={editorRef}
        className="min-h-[240px] p-4 focus:outline-none prose max-w-none"
        contentEditable
        onInput={handleInput}
        suppressContentEditableWarning
      />
    </div>
  )
}

export default RichTextEditor


