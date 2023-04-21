
import { ViewEnums } from "../../ui/views/ViewEnums"
import { PanelEnums } from "../../ui/panels/PanelEnums"
import { createStore, reconcile, SetStoreFunction } from 'solid-js/store'
import { mrkSolidStoreUpdater } from '../../lib/mrkSolidStoreUpdater'
import { omap } from "../../lib/omap"
import { omf } from "../../lib/omf"

type viewsType = { panel: PanelEnums, visible: boolean }

export type UIStoreType = {
	RootDocId?: string
	FullScreenElementName?: string
	selectedDocId?: string
	selectedElementName?: string

	views: omap<viewsType, ViewEnums>
}/*
[
	{
		view: ViewEnums.PropertiesView, panel: PanelEnums.rightPanel, visible: true

	},
	{ view: ViewEnums.DisplayView, panel: PanelEnums.middlePanel, visible: true },
	{ view: ViewEnums.SettingsView, panel: PanelEnums.leftPanel, visible: true },
	{ view: ViewEnums.LocalDocsView, panel: PanelEnums.leftPanel, visible: true }
],
*/
let UIStoreDefault: UIStoreType = {

	views: omf.setLot(omf.create<viewsType, ViewEnums>(), [{
		key: ViewEnums.DisplayView,
		object: {
			panel: PanelEnums.middlePanel,
			visible: true

		}
	}, {
		key: ViewEnums.LocalDocsView,
		object: {
			panel: PanelEnums.leftPanel,
			visible: true

		}
	}, {
		key: ViewEnums.PropertiesView,
		object: {
			panel: PanelEnums.rightPanel,
			visible: true

		}
	}, {
		key: ViewEnums.SettingsView,
		object: {
			panel: PanelEnums.rightPanel,
			visible: true

		}
	}


	]),

	RootDocId: '',
	selectedDocId: '',
	selectedElementName: ''
}


export const [UIStore, UIStoreSet] = createStore(UIStoreDefault)


export let UIStoreUpdater = new mrkSolidStoreUpdater(UIStore, UIStoreSet)
export let UIStoreReducers = {

	VisibleView: (args: ViewEnums) => {

		UIStoreUpdater.updateStore((value) => {
			omf.updateCallback(value.views, args, (view) => { 
				view.visible = !view.visible
				return view
			})		
			return value
		})

	}




}