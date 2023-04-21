import { QueryDataType } from "../QuerySaved/QuerySavedType"

export interface QueryStaticType<requestDataType,responseDataType> {

      queryFunction(requestData: requestDataType): Promise<responseDataType>



}     