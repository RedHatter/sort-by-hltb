import type { HLTBStats } from "./GameInfoData"
import { getMemCache } from "./cache"

const proxyCollection = (eSortBy: number, collection: object) => {
  const stat =
    eSortBy === 41 ? "mainStat" : eSortBy === 42 ? "mainPlusStat" : eSortBy === 43 ? "completeStat" : "allStylesStat"

  const appHandler = {
    get(target: object, prop: string, receiver: unknown) {
      if (prop === "minutes_playtime_forever" && "appid" in target && typeof target.appid === "number") {
        const data = getMemCache<HLTBStats>(target.appid.toString())
        return !data || data?.[stat] === "--" ? 0 : Number.parseFloat(data[stat]) * 60
      }

      return Reflect.get(target, prop, receiver)
    },
  }

  return new Proxy(collection, {
    get(target: object, prop: string, receiver: unknown) {
      const value = Reflect.get(target, prop, receiver)

      if (prop === "visibleApps") {
        return value.map((app: object) => new Proxy(app, appHandler))
      }

      return value
    },
  })
}

export default proxyCollection
