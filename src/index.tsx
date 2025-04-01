import { definePlugin, routerHook } from "@decky/api"
import { ButtonItem, PanelSection, PanelSectionRow, staticClasses } from "@decky/ui"
import type { FC } from "react"
import { LiaSortNumericDownAltSolid } from "react-icons/lia"
import { clearCache } from "./cache"
import patchLibrary from "./patchLibrary"

const Content: FC = () => (
  <PanelSection>
    <PanelSectionRow>
      <ButtonItem layout="below" onClick={() => clearCache()}>
        Clear Cache
      </ButtonItem>
    </PanelSectionRow>
  </PanelSection>
)

export default definePlugin(() => {
  const patch = routerHook.addPatch("/library", patchLibrary)

  return {
    name: "Sort by HLTB",
    titleView: <div className={staticClasses.Title}>Sort by HLTB</div>,
    content: <Content />,
    icon: <LiaSortNumericDownAltSolid />,
    onDismount: () => routerHook.removePatch("/library", patch),
  }
})
