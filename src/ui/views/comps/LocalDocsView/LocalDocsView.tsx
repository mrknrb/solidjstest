import Dexie from "dexie"
import { omf } from "../../../../lib/omf"
import { QueryEnums } from "../../../../stores/datastore/QueryEnums"
import { QueryStaticOMap } from "../../../../stores/datastore/QueryStatic/QueryStaticOMap"
import { LocalRequestTypesEnums } from "../../../../stores/datastore/QueryStatic/QueryType/QueryDataStaticLocal"
import { LocalRequestType } from "../../../../stores/datastore/QueryStatic/QueryType/LocalRequestType"
import { QueryStaticType } from "../../../../stores/datastore/QueryStatic/QueryStaticType"
import { For, createSignal } from "solid-js"
import LocalDocsViewDBDocList from "./LocalDocsViewDBTableList"
import ListClick, { ListClickRecursiveFunType } from "../../../general/ListClick"

export default function LocalDocsView() {


  
let clickFunctionRecursive: ListClickRecursiveFunType = []
  clickFunctionRecursive.push(async(argRecursive: string[], recursiveNumber: number) => {
    return await omf.get<QueryStaticType<LocalRequestType, any>>(QueryStaticOMap, QueryEnums.local)?.queryFunction({ RequestTypeEnum: LocalRequestTypesEnums.database })
  })
   clickFunctionRecursive.push((argRecursive: string[], recursiveNumber: number) => {
     return omf.get(QueryStaticOMap, QueryEnums.local)?.queryFunction({ RequestTypeEnum: LocalRequestTypesEnums.table, requestArg: argRecursive[1] })
   })
   clickFunctionRecursive.push((argRecursive: string[], recursiveNumber: number) => {
     return omf.get(QueryStaticOMap, QueryEnums.local)?.queryFunction({ RequestTypeEnum: LocalRequestTypesEnums.doc, requestArg: { dbname: argRecursive[1], tableName: argRecursive[2] } })
   })
  clickFunctionRecursive.push((argRecursive: string[], recursiveNumber: number) => {
     return omf.get(QueryStaticOMap, QueryEnums.local)?.queryFunction({ RequestTypeEnum: LocalRequestTypesEnums.object, requestArg: { dbname: argRecursive[1], tableName: argRecursive[2], docId: argRecursive[3] } })
   })
  return (
    <div class="mrkScroll bg-gray-800 ">
     
      <ListClick argRecursive={[""]} clickFunctionRecursive={clickFunctionRecursive} recursiveNumber={0}></ListClick>
    </div>
  )
}
