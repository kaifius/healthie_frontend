import { useEffect } from 'react'
import './Undo.css'

type UndoProps = {
  /** False when there is nothing left to undo. */
  canUndo: boolean
  onUndo: () => void
}

/** True for ⌘Z on a Mac and Ctrl+Z elsewhere, but not for the redo chord. */
function isUndoChord(event: KeyboardEvent): boolean {
  return (
    event.key.toLowerCase() === 'z' &&
    (event.metaKey || event.ctrlKey) &&
    !event.shiftKey &&
    !event.altKey
  )
}

/** While typing, ⌘Z belongs to the field's own undo stack, not to ours. */
function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement)
  )
}

export function Undo({ canUndo, onUndo }: UndoProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!isUndoChord(event) || isTypingTarget(event.target)) return

      event.preventDefault()
      if (canUndo) onUndo()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [canUndo, onUndo])

  return (
    <button
      className="undo-button"
      type="button"
      onClick={onUndo}
      disabled={!canUndo}
      title="Undo the last change (⌘Z / Ctrl+Z)"
    >
      Undo
    </button>
  )
}
