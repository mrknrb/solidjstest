import { createSignal, For, Show } from "solid-js"
import { UIStore } from "../../stores/uistore/UIStore"
import PanelButton from "./PanelButton"
import { PanelEnums } from "./PanelEnums"
import { omf } from "../../lib/omf"
import { ViewsOMap } from "../views/ViewsOMap"

export default function Panel(props: { PanelType: PanelEnums }) {
  let panelClass = () => {
    if (props.PanelType === PanelEnums.leftPanel) {
      return "border-r-4 flex-row basis-60 "
    } else if (props.PanelType === PanelEnums.rightPanel) {
      return "border-l-4 flex-row-reverse basis-60 "
    } else if (props.PanelType === PanelEnums.middlePanel) {
      return " flex-col basis-auto flex-grow"
    }
  }

  return (
    <div class={"mrkDefault flex-row border-gray-900 flex-shrink  " + panelClass()}>
      <div class="relative basis-5 bg-gray-700 ">
        <For each={omf.toArray(UIStore.views).objectsKeys}>
          {(view) => {
            return (
              <>
                <Show when={view.object.panel === props.PanelType}>
                  <PanelButton menuItem={view.key} PanelType={view.object.panel}></PanelButton>
                </Show>
              </>
            )
          }}
        </For>
      </div>

      <div class="relative bg-gray-800 flex flex-col overflow-auto" style="flex: 1 1 auto ">
        <For each={omf.toArray(UIStore.views).objectsKeys}>
          {(view) => {
            return (
              <>
                <Show when={view.object.panel === props.PanelType}><>{omf.get(ViewsOMap, view.key)}</> </Show>
              </>
            )
          }}
        </For>
      </div>
    </div>
  )
}
