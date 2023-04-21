import { omf } from "../../../lib/omf"
import { QueryEnums } from "../QueryEnums"
import { QueryStaticType } from "./QueryStaticType"
import { QueryDataStaticLocal } from "./QueryType/QueryDataStaticLocal"

export let QueryStaticOMap = omf.create<QueryStaticType, QueryEnums > ()
omf.set(QueryStaticOMap, QueryEnums.local, QueryDataStaticLocal)
