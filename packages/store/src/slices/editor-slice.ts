import { EditorView } from '@mc/shared/types/view'
import { StateCreator } from 'zustand'

export interface EditorSlice {
  openEditors: EditorView[]
  focusedEditor: EditorView | null
  openEditor: (editor: EditorView) => void
  closeEditor: (editor: EditorView) => void
  closeAllEditors: () => void
  closeOtherEditors: (editor: EditorView) => void
  setFocusedEditor: (editor: EditorView | null) => void
}

export const createEditorSlice: StateCreator<EditorSlice> = set => ({
  openEditors: [],
  focusedEditor: null,

  openEditor: (editor: EditorView) => {
    set(state => ({
      openEditors: [...state.openEditors, editor],
    }))
  },
  closeEditor: (editor: EditorView) => {
    set(state => ({
      openEditors: state.openEditors.filter(e => e !== editor),
    }))
  },
  closeAllEditors: () => {
    set({ openEditors: [] })
  },
  closeOtherEditors: (editor: EditorView) => {
    set(() => ({
      openEditors: [editor],
    }))
  },
  setFocusedEditor: (editor: EditorView | null) => {
    set({ focusedEditor: editor })
  },
})
