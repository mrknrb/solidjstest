import { omap } from "../../lib/omap"
import { omf } from "../../lib/omf"
import { ViewEnums } from "./ViewEnums"
import LocalDocsView from "./comps/LocalDocsView/LocalDocsView"

export let ViewsOMap = omf.create<JSX.Element, ViewEnums>({
  [ViewEnums.DisplayView]: "",
  [ViewEnums.PropertiesView]: "",
  [ViewEnums.SettingsView]: "",
  [ViewEnums.LocalDocsView]: LocalDocsView,
})
