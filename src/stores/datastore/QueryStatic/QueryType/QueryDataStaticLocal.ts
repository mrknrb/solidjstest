import Dexie from "dexie"
import { QueryDataType } from "../../QuerySaved/QuerySavedType"
import { omf } from "../../../../lib/omf"
import { LocalRequestType } from "./LocalRequestType"
import { QueryStaticType } from "../QueryStaticType"
export enum LocalRequestTypesEnums {
    database = "database",
    table = "table",
    doc = "doc",
    object = "object"
}
export let QueryDataStaticLocal: QueryStaticType<LocalRequestType,any> = {
    async queryFunction(requestData ) {
        let a = omf.get(LocalRequestTypes, requestData.RequestTypeEnum)
        if (!a) return
        return a(requestData.requestArg)
    }
}


let LocalRequestTypes = omf.setLot(omf.create<(arg: any) => any, LocalRequestTypesEnums>(), [{
    key: LocalRequestTypesEnums.database,
    object: async () => {
        // var db = new Dexie("test")
        const databases = await Dexie.getDatabaseNames()
        return databases
    }
}, {
    key: LocalRequestTypesEnums.table,
    object: async (dbname: string) => {
        const myPromise = new Promise((resolve, reject) => {
            const openRequest = indexedDB.open(dbname)
            openRequest.onsuccess = (event) => {
                const db = event.target.result
                const objectStoreNames = db.objectStoreNames
                resolve(objectStoreNames)
            }
        })
        return await myPromise
    }


    }, {
        key: LocalRequestTypesEnums.doc,
        object: async (arg: { dbname: string, tableName: string }) => {
       
            return new Promise((resolve, reject) => {
                // Open the database
                const request = window.indexedDB.open(arg.dbname)

                // Handle success
                request.onsuccess = (event) => {
                    const db = event.target.result

                    // Start a transaction
                    const transaction = db.transaction(arg.tableName, 'readonly')

                    // Get the object store
                    const objectStore = transaction.objectStore(arg.tableName)

                    // Retrieve all documents from the object store
                    const getAllRequest = objectStore.getAllKeys()

                    // Handle success
                    getAllRequest.onsuccess = (event) => {
                        const documents = event.target.result
                        resolve(documents)
                    }

                    // Handle error
                    getAllRequest.onerror = (event) => {
                        reject(event.target.error)
                    }
                }

                // Handle error
                request.onerror = (event) => {
                    reject(event.target.error)
                }
            })
        

        }
    }, {
        key: LocalRequestTypesEnums.object,
        object: async (arg: { dbname: string, tableName: string,docId:string }) => {

            return new Promise((resolve, reject) => {
                // Open the database
                const request = window.indexedDB.open(arg.dbname)

                // Handle success
                request.onsuccess = (event) => {
                    const db = event.target.result

                    // Start a transaction
                    const transaction = db.transaction(arg.tableName, 'readonly')

                    // Get the object store
                    const objectStore = transaction.objectStore(arg.tableName)

                    // Retrieve all documents from the object store
                    const getAllRequest = objectStore.get(arg.docId)

                    // Handle success
                    getAllRequest.onsuccess = (event) => {
                        const documents = event.target.result
                      
                        resolve(omf.toArray(documents).objects)
                    }

                    // Handle error
                    getAllRequest.onerror = (event) => {
                        reject(event.target.error)
                    }
                }

                // Handle error
                request.onerror = (event) => {
                    reject(event.target.error)
                }
            })


        }
    }



])