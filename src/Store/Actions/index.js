import { HAS_CREATED_DATABASE } from "../ActionTypes"

export const setHasCreatedDatabase = hasCreatedDatabase => {
  return {
    type: HAS_CREATED_DATABASE,
    hasCreatedDatabase
  }
}
