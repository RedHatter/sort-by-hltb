import type { HLTBStats } from "./GameInfoData"
import { fetchHltbGameStats } from "./HltbApi"
import { getCache, updateCache } from "./cache"

export const needCacheUpdate = (lastUpdatedAt: Date | undefined) => {
  if (!lastUpdatedAt) return true

  const now = new Date()
  const durationMs = Math.abs(lastUpdatedAt.getTime() - now.getTime())

  const hoursBetweenDates = durationMs / (60 * 60 * 1000)
  return hoursBetweenDates > 720 // One month;
}

export const getHltbData = async (
  appId: number,
  appName: string,
  fallback: HLTBStats = {
    mainStat: "--",
    mainPlusStat: "--",
    completeStat: "--",
    allStylesStat: "--",
    gameId: undefined,
    lastUpdatedAt: new Date(),
    showStats: true,
  },
) => {
  const cache = await getCache<HLTBStats>(`${appId}`)
  if (cache && !needCacheUpdate(cache.lastUpdatedAt)) {
    return cache
  }

  console.log(`get HLTB data for ${appId} and ${appName}`)

  const hltbGameStats = await fetchHltbGameStats(appName, appId, cache?.gameId)
  if (hltbGameStats) {
    const newStats = {
      ...hltbGameStats,
      showStats: cache?.showStats ?? true,
      version: 1,
    }
    updateCache(`${appId}`, newStats)

    console.log(`HLTB data updated for ${appId}. Using HLTB game id ${hltbGameStats.gameId}.`)

    return newStats
  }

  updateCache(`${appId}`, fallback)

  console.log(`Unable to find HLTB data for ${appId}.`)

  return fallback
}
