import { reconcile, SetStoreFunction } from "solid-js/store"

export class mrkSolidStoreUpdater<storeGet>{
	private storeGet: storeGet
	private storeSet: SetStoreFunction<storeGet>
	constructor(storeGet: storeGet, storeSet: SetStoreFunction<storeGet>) {
		this.storeGet = storeGet
		this.storeSet = storeSet
	}

	updateStore(callback: (storeCopy: storeGet) => storeGet) {
	let storeGetCopy: storeGet = JSON.parse(JSON.stringify(this.storeGet))
		this.storeSet(reconcile(callback(storeGetCopy)))
	}

}