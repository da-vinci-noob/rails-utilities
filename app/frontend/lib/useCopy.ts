import { ref } from 'vue'

export type CopyFeedback = 'idle' | 'copied' | 'error'

export function useCopy() {
  const state = ref<CopyFeedback>('idle')
  let timer: ReturnType<typeof setTimeout> | undefined

  async function copy(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text)
      state.value = 'copied'
    } catch {
      state.value = 'error'
    }
    clearTimeout(timer)
    timer = setTimeout(() => (state.value = 'idle'), 1600)
    return state.value === 'copied'
  }

  return { state, copy }
}
