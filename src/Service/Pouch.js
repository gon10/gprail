import { applicationConfig } from "../Store/Reducers/ApplicationConfig"
import PouchDB from "pouchdb"
import PouchdbFind from "pouchdb-find"
import pouchdbDebug from "pouchdb-debug"

PouchDB.plugin(PouchdbFind)
PouchDB.plugin(require("crypto-pouch"))
PouchDB.plugin(require("pouchdb-quick-search"))

const pouch = new PouchDB("rail-app", { auto_compaction: true })

pouch.createIndex({
  index: {
    fields: [
      "id",
      "memo",
      "synced",
      "date_created",
      "date_synced",
    ],
    name: "searchable-index",
    ddoc: "searchable-index"
  }
}).catch(error => {})

if (process.env.NODE_ENV === "production") {
  pouch.crypto({
    password: applicationConfig.CRYPTO_KEY
  })
} else {
  PouchDB.plugin(pouchdbDebug)
  PouchDB.debug.enable("pouchdb:find")
}

export const deleteAllDocs = () => {
  return new Promise((resolve, reject) => {
    pouch.allDocs({ include_docs: true }).then(result => {
      const docsToRemove = result.rows.map(item => {
        item._deleted = true
        return item
      })

      pouch.bulkDocs(docsToRemove).then(() => resolve(true))
    })
  })
}

export default pouch
