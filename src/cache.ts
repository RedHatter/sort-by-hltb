import localforage from "localforage"

localforage.config({
  name: "hltb-for-deck", // Share database with "HLTB for Deck"
})

const memCache = new Map<string, unknown>()

export async function updateCache<T>(key: string, value: T) {
  memCache.set(key, value)
  await localforage.setItem(key, value)
}

export function getMemCache<T>(key: string): T | undefined {
  return memCache.get(key) as T
}

export async function getCache<T>(key: string): Promise<T | null> {
  const value = await localforage.getItem<T>(key)
  memCache.set(key, value)
  return value
}

export const clearCache = () => {
  localforage.clear()
  memCache.clear()
}
