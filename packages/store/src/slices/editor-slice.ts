import { Editor } from '@mc/shared/types/editor'
import { StateCreator } from 'zustand'

export interface EditorSlice {
  openEditors: Editor[]
  focusedEditor: Editor | null
  openEditor: (editor: Editor) => void
  closeEditor: (editor: Editor) => void
  closeAllEditors: () => void
  closeOtherEditors: (editor: Editor) => void
  setFocusedEditor: (editor: Editor | null) => void
}

export const createEditorSlice: StateCreator<EditorSlice> = set => ({
  openEditors: [],
  focusedEditor: null,

  openEditor: (editor: Editor) => {
    set(state => ({
      openEditors: [...state.openEditors, editor],
    }))
  },
  closeEditor: (editor: Editor) => {
    set(state => ({
      openEditors: state.openEditors.filter(e => e !== editor),
    }))
  },
  closeAllEditors: () => {
    set({ openEditors: [] })
  },
  closeOtherEditors: (editor: Editor) => {
    set(() => ({
      openEditors: [editor],
    }))
  },
  setFocusedEditor: (editor: Editor | null) => {
    set({ focusedEditor: editor })
  },
})
