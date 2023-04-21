
import { ViewEnums } from "../../ui/views/ViewEnums"
import { PanelEnums } from "../../ui/panels/PanelEnums"
import { createStore, reconcile, SetStoreFunction } from 'solid-js/store'
import { mrkSolidStoreUpdater } from '../../lib/mrkSolidStoreUpdater'

export type DocStoreType = {
	docs: Map<string, any>
}

let DocStoreDefault: DocStoreType = {
	docs: new Map()
}


export const [DocStore, DocStoreSet] = createStore(DocStoreDefault)


export let DocStoreUpdater = new mrkSolidStoreUpdater(DocStore, DocStoreSet)
export let DocStoreReducers = {




}