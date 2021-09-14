module Migrations = Services_IndexedDB_Migrations

let idbDatabase = ref(None)

let open_ = () => {
  open Externals.IndexedDB
  let openReq = IDBFactory.open_("braudel", Some(Migrations.currentVersion))
  switch idbDatabase.contents {
  | Some(idbDatabase) => Js.Promise.resolve(idbDatabase)
  | None =>
    Js.Promise.make((~resolve, ~reject) => {
      let eventHandlers = [
        #success(
          _ => {
            switch IDBOpenDBRequest.result(openReq) {
            | Some(result) => resolve(. result)
            | None => reject(. IDBOpenDBRequest.Error(None))
            }
          },
        ),
        #error(
          _ => {
            reject(. IDBOpenDBRequest.Error(IDBOpenDBRequest.error(openReq)))
          },
        ),
        #blocked(_ => Js.log("blocked")),
        #upgradeneeded(
          (ev: Event.versionChange) => {
            switch IDBOpenDBRequest.result(openReq) {
            | Some(result) =>
              let _ = switch Migrations.execute(
                ~currentVersion=ev.oldVersion,
                ~targetVersion=ev.newVersion,
                result,
              ) {
              | Ok(_) => resolve(. result)
              | Error(e) =>
                Services_Logger.error(e)
                reject(. e)
              }
            | None => reject(. IDBOpenDBRequest.Error(None))
            }
          },
        ),
      ]
      eventHandlers->Belt.Array.forEach(h => IDBOpenDBRequest.addEventListener(openReq, h))
    }) |> Js.Promise.then_(db => {
      idbDatabase := Some(db)
      Js.Promise.resolve(db)
    })
  }
}

let transaction = (~db, ~objectStoreNames, ~mode, ~durability, cb) => {
  open Externals.IndexedDB
  Js.Promise.make((~resolve, ~reject) => {
    let transaction =
      db->IDBDatabase.transaction(objectStoreNames, mode, {durability: durability})

    let unit_ = ()
    let eventHandlers = [
      #complete(_ => resolve(. unit_)),
      #error(_ => reject(. IDBTransaction.Error(IDBTransaction.error(transaction)))),
      #abort(_ => reject(. IDBTransaction.Abort)),
    ]
    let _ = eventHandlers->Belt.Array.forEach(l => IDBTransaction.addEventListener(transaction, l))
    let _ = cb(transaction)
  })
}
