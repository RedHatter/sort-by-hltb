import { afterPatch, showContextMenu } from "@decky/ui"
import type { ReactElement } from "react"
import SortByMenu from "./SortByMenu"
import * as cacheQueue from "./cacheQueue"
import proxyCollection from "./proxyCollection"

const patchTabProps = (props: any) => {
  const { setSortBy, eSortBy, collection } = props

  collection.visibleApps.forEach(cacheQueue.put)

  if (cacheQueue.store.state.queue.length > 0) {
    setSortBy(1)
    cacheQueue.run().then(() => {
      if (!cacheQueue.store.state.aborted) {
        setSortBy(eSortBy)
      }
    })
  } else {
    props.collection = proxyCollection(eSortBy, collection)
    props.eSortBy = 4
  }
}

const patchTabs = (tabs: Array<any>, activeTab: string) => {
  for (const tab of tabs) {
    const { setSortBy, eSortBy, collection } = tab.content.props

    tab.content.props.showSortingContextMenu = () => showContextMenu(<SortByMenu setSortBy={setSortBy} />)

    if (tab.footer) {
      tab.footer.onOptionsButton = tab.content.props.showSortingContextMenu
    }

    if (tab.id === activeTab && eSortBy >= 40 && eSortBy <= 49) {
      if (collection) {
        patchTabProps(tab.content.props)
      } else {
        if (!tab.content?.type) {
          console.error("sort-by-hltb failed to find collection tab element to patch")
        } else {
          afterPatch(tab.content, "type", (_: unknown, ret: ReactElement) => {
            if (ret.props?.children?.[0]?.type) {
              afterPatch(ret.props.children[0], "type", (_: unknown, ret2: ReactElement) => {
                if (ret2.props?.children?.[1]?.props?.collection) {
                  patchTabProps(ret2.props.children[1].props)
                } else {
                  console.error("sort-by-hltb failed to find collection within the collection tab")
                }

                return ret2
              })
            }

            return ret
          })
        }
      }
    }
  }
}

const patchLibrary = (props: { path: string; children: ReactElement }) => {
  afterPatch(props.children, "type", (_: unknown, ret1: ReactElement) => {
    if (!ret1?.type) {
      console.error("sort-by-hltb failed to find first library element to patch")
      return ret1
    }

    afterPatch(ret1, "type", (_: unknown, ret2: ReactElement) => {
      if (!ret2?.type) {
        console.error("sort-by-hltb failed to find second library element to patch")
        return ret2
      }

      afterPatch(ret2.type, "type", (_: unknown, ret3: ReactElement) => {
        const { tabs, activeTab } = ret3.props.children.props.children[1].props

        patchTabs(tabs, activeTab)

        return ret3
      })

      return ret2
    })

    return ret1
  })

  return props
}

export default patchLibrary
