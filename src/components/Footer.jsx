import { useState } from 'react'
import SettingsSheet from './SettingsSheet'

export default function Footer({ onReset }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="border-t border-gray-700 px-4 py-4 mt-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <p className="text-xs text-gray-600">Álbum Copa do Mundo 2026 • Panini</p>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-700/50"
          >
            <span>⚙️</span>
            <span>Configurações</span>
          </button>
        </div>
      </div>

      <SettingsSheet
        open={open}
        onClose={() => setOpen(false)}
        onReset={onReset}
      />
    </>
  )
}
