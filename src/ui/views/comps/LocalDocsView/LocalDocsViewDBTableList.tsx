import Dexie from "dexie"
import { omf } from "../../../../lib/omf"
import { QueryEnums } from "../../../../stores/datastore/QueryEnums"
import { QueryStaticOMap } from "../../../../stores/datastore/QueryStatic/QueryStaticOMap"
import { LocalRequestType } from "../../../../stores/datastore/QueryStatic/QueryType/LocalRequestType"
import { QueryStaticType } from "../../../../stores/datastore/QueryStatic/QueryStaticType"
import { For, createSignal } from "solid-js"
import { LocalRequestTypesEnums } from "../../../../stores/datastore/QueryStatic/QueryType/QueryDataStaticLocal"

export default function LocalDocsViewDBDocList(props: { databaseName: string }) {
  let [docs, setDocs] = createSignal([])
  let refreshfunction = async () => {
    setDocs(await omf.get(QueryStaticOMap, QueryEnums.local)?.queryFunction({ RequestTypeEnum: LocalRequestTypesEnums.table, requestArg: props.databaseName }))
  }

  return (
    <>
      <b
        class="text-gray-300 bg-gray-600 hover:bg-gray-500 hover:cursor-pointer"
        onclick={() => {
          refreshfunction()
        }}
      >
        {props.databaseName}
      </b>
      <For each={docs()}>
        {(doc) => {
          return (
            <>
              <b class="text-gray-300  hover:bg-gray-500 hover:cursor-pointer">{doc}</b>
            </>
          )
        }}
      </For>
    </>
  )
}
