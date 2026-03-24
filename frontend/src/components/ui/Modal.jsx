import { X } from 'lucide-react'
import { useEffect } from 'react'

export default function Modal({ open, onClose, title, children, footer }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-center justify-center p-5 animate-fadeIn"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl animate-rise">
        <div className="flex items-center justify-between px-7 py-6 border-b border-border-soft sticky top-0 bg-white z-10">
          <h2 className="font-serif text-2xl font-normal text-ink">{title}</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-ink-soft hover:bg-parchment hover:text-ink transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-7 py-6">{children}</div>
        {footer && (
          <div className="px-7 pb-7 pt-4 border-t border-border-soft flex gap-3 justify-end">{footer}</div>
        )}
      </div>
    </div>
  )
}
