import { showModal } from "@decky/ui"
import { Store } from "@tanstack/react-store"
import type { HLTBStats } from "./GameInfoData"
import ProgressModal from "./ProgressModal"
import { getMemCache } from "./cache"
import { getHltbData, needCacheUpdate } from "./getHltbData"

type App = {
  appid: number
  display_name: string
}

export const store = new Store({
  queue: [] as Array<App>,
  locked: false,
  aborted: false,
  total: 0,
})

export const put = (app: App) =>
  store.setState((state) => {
    const cached = getMemCache<HLTBStats>(app.appid.toString())

    if (state.queue.includes(app) || !needCacheUpdate(cached?.lastUpdatedAt)) {
      return state
    }

    return {
      ...state,
      queue: [...state.queue, app],
      aborted: false,
      total: state.total + 1,
    }
  })

const take = () => {
  const app = store.state.queue[0]

  store.setState((state) => ({
    ...state,
    queue: state.queue.slice(1),
  }))

  return app
}

export const abort = () =>
  store.setState((state) => ({
    ...state,
    aborted: true,
  }))

export const run = async () => {
  if (store.state.locked) return

  store.setState((state) => ({ ...state, locked: true }))

  const { Close } = showModal(<ProgressModal />)

  while (store.state.queue.length && !store.state.aborted) {
    const app = take()

    await getHltbData(app.appid, app.display_name)
  }

  Close()

  store.setState((state) => ({
    ...state,
    locked: false,
    queue: [],
    total: 0,
  }))
}
