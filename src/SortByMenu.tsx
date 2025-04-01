import { Menu, MenuGroup, MenuItem, findModuleChild } from "@decky/ui"
import type { FC } from "react"

export const localize = findModuleChild(
  (m) =>
    typeof m === "object" &&
    Object.values(m).find((p) => typeof p === "function" && /function.*LocalizeString.*return void/.test(p.toString())),
)

type SortByMenuProps = {
  setSortBy: (sortBy: number) => void
}

const SortByMenu: FC<SortByMenuProps> = ({ setSortBy }) => (
  <Menu label="">
    <MenuItem onClick={() => setSortBy(1)}>{localize("#Library_SortByAlphabetical")}</MenuItem>
    <MenuItem onClick={() => setSortBy(10)}>{localize("#Library_SortByFriendsPlaying")}</MenuItem>
    <MenuItem onClick={() => setSortBy(2)}>{localize("#Library_SortByPctAchievementsComplete")}</MenuItem>
    <MenuGroup label="How long to beat">
      <MenuItem onClick={() => setSortBy(41)}>Main Story</MenuItem>
      <MenuItem onClick={() => setSortBy(42)}>Main + Extras</MenuItem>
      <MenuItem onClick={() => setSortBy(43)}>Completionist</MenuItem>
      <MenuItem onClick={() => setSortBy(44)}>All Styles</MenuItem>
    </MenuGroup>
    <MenuItem onClick={() => setSortBy(4)}>{localize("#Library_SortByHoursPlayed")}</MenuItem>
    <MenuItem onClick={() => setSortBy(5)}>{localize("#Library_SortByLastPlayed")}</MenuItem>
    <MenuItem onClick={() => setSortBy(6)}>{localize("#Library_SortByReleaseDate")}</MenuItem>
    <MenuItem onClick={() => setSortBy(7)}>{localize("#Library_SortByAddedToLibrary")}</MenuItem>
    <MenuItem onClick={() => setSortBy(8)}>{localize("#Library_SortBySizeOnDisk")}</MenuItem>
    <MenuItem onClick={() => setSortBy(9)}>{localize("#Library_SortByMetacriticScore")}</MenuItem>
    <MenuItem onClick={() => setSortBy(11)}>{localize("#Library_SortBySteamReview")}</MenuItem>
  </Menu>
)

export default SortByMenu
