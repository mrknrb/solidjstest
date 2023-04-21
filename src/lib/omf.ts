import { MrkLib } from './MrkLib'
import { omap } from './omap'

export class omf {
	static create<dataType, keyEnum = string>(anyObject?: any): omap<dataType, keyEnum> {
		// nem biztonsagos annyira
		
		return anyObject||{} as omap<dataType,keyEnum>
	}

	static set<dataType, keyEnum = string>(
		oMap: omap<dataType,keyEnum> | undefined,
		key: string | undefined,
		object: dataType
	) {
		if (!oMap || !key) return undefined
		// @ts-ignore
		oMap[key] = object
		return oMap
	}
	static setLot<dataType, keyEnum = string>(
		oMap: omap<dataType,keyEnum>,

		objects: {
			key: keyEnum 
			object: dataType
		}[]
	) {
		
		objects?.forEach((keyObject) => {
			if (keyObject && keyObject.key) {
			// @ts-ignore
			oMap[keyObject.key] = keyObject.object}
		})
		return oMap
	}
	static updateCallback<dataType, keyEnum = string>(
		oMap: omap<dataType,keyEnum> | undefined,
		key: string | undefined,
		callback: (objectOld: dataType) => dataType
	) {
		if (!oMap || !key) return undefined

		let objectOld = omf.get(oMap, key)
		if (!objectOld) return undefined
		let objectUpdated = callback(objectOld)
	return 	omf.set(oMap, key, objectUpdated)
		
	}

	static get<dataType, keyEnum = string>(oMap: omap<dataType,keyEnum> , key: string ) {
		//if (!oMap || !key) return undefined
		// @ts-ignore
		return oMap[key] as dataType 
	}
	static getLot<dataType, keyEnum = string>(oMap: omap<dataType,keyEnum> | undefined, keys: (string | undefined)[]) {
		let answer = { success: omf.create<dataType,keyEnum>(), fail: omf.create<dataType,keyEnum>() }
		if (!oMap || !keys) return answer
		keys.forEach((key) => {
			let object = omf.get(oMap, key)
			if (object === undefined) {
				omf.set(answer.fail, key, undefined)
			} else {
				omf.set(answer.success, key, object)
			}
		})
		return answer
	}
	static delete<dataType, keyEnum = string>(oMap: omap<dataType, keyEnum > | undefined, key: string | undefined) {
		// @ts-ignore
		if (!oMap || !key || !oMap[key]) return undefined
		// @ts-ignore
		delete oMap[key]
	}
	static getOrCreate<dataType, keyEnum = string>(oMap: omap<dataType,keyEnum> | undefined, key: string | undefined) {
		if (!oMap || !key) return undefined
		let result = this.get(oMap, key)
		if (result) return result
		this.set(oMap, key, {})

		return this.get(oMap, key)
	}
	static forEach<dataType, keyEnum = string>(
		oMap: omap<dataType,keyEnum> | undefined,
		forEachCallback: (object: dataType, key: string) => any
	) {
		if (!oMap) return undefined
		MrkLib.forEachInObject<dataType,keyEnum>(oMap, (object, key) => {
			// @ts-ignore
			forEachCallback(object, key)
		})
	}

	static find<dataType, keyEnum = string>(
		oMap: omap<dataType,keyEnum>,
		findCallback: (object: dataType, key: string) => boolean
	) {
		let answer: { key: string; object: dataType } | undefined = undefined
		MrkLib.forEachInObject<dataType,keyEnum>(oMap, (object, key) => {
			if (findCallback(object, key)) {
				answer = { object, key }
			}
		})
		return answer
	}
	static filter<dataType, keyEnum = string>(
		oMap: omap<dataType,keyEnum>,
		callback: (object: dataType, key: string) => boolean
	) {
		let answer: omap<dataType,keyEnum> = omf.create()
		MrkLib.forEachInObject<dataType,keyEnum>(oMap, (object, key) => {
			if (callback(object, key)) {
				omf.set(answer, key, object)
			}
		})
		return answer
	}
	static map<dataType, keyEnum = string>(oMap: omap<dataType,keyEnum>, callback: (object: dataType, key: string) => any) {
		let answer: any[] = []
		MrkLib.forEachInObject<dataType,keyEnum>(oMap, (object, key) => {
			if (callback(object, key)) {
				answer.push(callback(object, key))
			}
		})
		return answer
	}
	static toArray<dataType, keyEnum = string>(oMap: omap<dataType,keyEnum> ) {
		let answer: {
			objects: dataType[]
			objectsKeys: { key: keyEnum; object: dataType }[]
			keys: (keyEnum)[]
		} = {
			objectsKeys: [],
			objects: [],
			keys: []
		}
		if (!oMap) return answer
		MrkLib.forEachInObject (oMap, (object, key) => {
			answer.objectsKeys.push({ key, object })
			answer.keys.push(key)
			answer.objects.push(object)
		})
		return answer
	}
	static merge<dataType, keyEnum = string>(oMap: omap<dataType,keyEnum>, otherObject: omap<dataType,keyEnum>) {
		for (var attrname in otherObject) {
			// @ts-ignore
			oMap[attrname] = otherObject[attrname]
		}
	}
	static changeKey<dataType, keyEnum = string>(oMap: omap<dataType, keyEnum>, oldKey: string, newKey: string) {
		MrkLib.changeObjectKey(oMap, oldKey, newKey)
	}
}
