
import { createSignal, For, Show } from "solid-js"
import Panel from "./ui/panels/Panel"
import { PanelEnums } from "./ui/panels/PanelEnums"
import { FaSolidHandPointLeft } from 'solid-icons/fa'
import { createStore, produce, reconcile } from "solid-js/store"
import MenuPanel from "./ui/panels/MenuPanel"
export default function App() {




    return <>

        <div
            class="mrkDefault flex-row  bg-gray-400 "
        >

            <Panel PanelType={PanelEnums.leftPanel} />
            <Panel PanelType={PanelEnums.middlePanel} />
            <Panel PanelType={PanelEnums.rightPanel} />
        </div>

        <MenuPanel></MenuPanel>
    </>
}
