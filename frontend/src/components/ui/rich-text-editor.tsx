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
    if (!editorRef.current) return
    const editorEl = editorRef.current
    editorEl.focus()
    const before = editorEl.innerHTML
    document.execCommand(command, false, arg)
    const after = editorEl.innerHTML
    if (after === before && arg) {
      // Fallback: try alternative argument style like '<h2>' vs 'H2'
      const altArg = arg.startsWith('<') ? arg.replace(/[<>]/g, '').toUpperCase() : `<${arg.toLowerCase()}>`
      document.execCommand(command, false, altArg)
    }
    onChange(editorEl.innerHTML)
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
        <button type="button" className="px-2 py-1 text-sm rounded hover:bg-gray-100" onMouseDown={(e) => { e.preventDefault(); exec('bold') }}>B</button>
        <button type="button" className="px-2 py-1 text-sm italic rounded hover:bg-gray-100" onMouseDown={(e) => { e.preventDefault(); exec('italic') }}>I</button>
        <button type="button" className="px-2 py-1 text-sm underline rounded hover:bg-gray-100" onMouseDown={(e) => { e.preventDefault(); exec('underline') }}>U</button>
        <button type="button" className="px-2 py-1 text-sm rounded hover:bg-gray-100" onMouseDown={(e) => { e.preventDefault(); const url = window.prompt('Enter URL'); if (url) exec('createLink', url) }}>Link</button>
        <button type="button" className="px-2 py-1 text-sm rounded hover:bg-gray-100" onMouseDown={(e) => { e.preventDefault(); insertImageByUrl() }}>Image</button>
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


