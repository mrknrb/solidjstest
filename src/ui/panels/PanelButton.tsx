


import { createSignal, For, Show } from "solid-js"
import { UIStore, UIStoreReducers } from "../../stores/uistore/UIStore"
import { ViewEnums } from "../views/ViewEnums"
import { PanelEnums } from "./PanelEnums"

export default function PanelButton(props: { menuItem: ViewEnums, PanelType:PanelEnums }) {

  let  rotetedcss = () => {
      if (props.PanelType === PanelEnums.leftPanel) {
            return ' writing-mode: tb-rl;	transform: rotate(-180deg);'
      } else if (props.PanelType === PanelEnums.rightPanel) {
            return ' writing-mode: tb-rl;'
      } else if (props.PanelType === PanelEnums.middlePanel) {
            return ' '
        }
    };

    return (


        <div
            class="p-1 "
            onclick={() => {
                UIStoreReducers.VisibleView(props.menuItem)

            }}
        >
            <b style={rotetedcss()} class="text-gray-300 hoverClick">
                {props.menuItem}
            </b>
        </div>
    )
}
