import {
    LayoutId,
    RESIZEABLE_PANEL_SIZE_KEY_PREFIX,
} from '@mc/shared/constants/layout'
import { cookies } from 'next/headers'

export const getDefaultSizeMap = async () => {
  const cookieStore = await cookies()
  const defaultSizeMap: Record<string, number[]> = [
    LayoutId.PLAYGROUND,
    LayoutId.WORKSPACE,
  ].reduce((acc, cur) => {
    const layout = cookieStore.get(`${RESIZEABLE_PANEL_SIZE_KEY_PREFIX}${cur}`)
    let defaultLayout: number[] | undefined
    if (layout) {
      defaultLayout = JSON.parse(layout.value) as typeof defaultLayout
    }
    return { ...acc, [cur]: defaultLayout ?? [10, 90] }
  }, {})

  return defaultSizeMap
}
