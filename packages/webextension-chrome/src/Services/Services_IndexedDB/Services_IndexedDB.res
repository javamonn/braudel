module Migrations = Services_IndexedDB_Migrations

exception EmptyCursor

open Externals.IndexedDB

let idbDatabase = ref(None)

let removeEventListeners = (target, remover, listeners) =>
  listeners->Belt.Option.forEach(listeners =>
    listeners->Belt.Array.forEach(l => remover(target, l))
  )
let addEventListeners = (target, adder, listeners) =>
  listeners->Belt.Option.forEach(listeners => listeners->Belt.Array.forEach(l => adder(target, l)))

let open_ = () => {
  switch idbDatabase.contents {
  | Some(idbDatabase) => Js.Promise.resolve(idbDatabase)
  | None =>
    let openReq = IDBFactory.open_("braudel", Some(Migrations.currentVersion))
    let eventListeners = ref(None)
    let onRemoveEventListeners = () =>
      removeEventListeners(openReq, IDBOpenDBRequest.removeEventListener, eventListeners.contents)

    Js.Promise.make((~resolve, ~reject) => {
      eventListeners :=
        Some([
          #success(
            _ => {
              onRemoveEventListeners()
              switch IDBOpenDBRequest.result(openReq) {
              | Some(result) => resolve(. result)
              | None => reject(. IDBOpenDBRequest.Error(None))
              }
            },
          ),
          #error(
            _ => {
              onRemoveEventListeners()
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
                | Ok(_) =>
                  onRemoveEventListeners()
                  resolve(. result)
                | Error(e) =>
                  onRemoveEventListeners()
                  Services_Logger.error("Services_IndexedDB", "open_", e)
                  reject(. e)
                }
              | None =>
                onRemoveEventListeners()
                reject(. IDBOpenDBRequest.Error(None))
              }
            },
          ),
        ])

      addEventListeners(openReq, IDBOpenDBRequest.addEventListener, eventListeners.contents)
    }) |> Js.Promise.then_(db => {
      idbDatabase := Some(db)
      Js.Promise.resolve(db)
    })
  }
}

let transaction = (~db, ~objectStoreNames, ~mode, ~durability, cb) => {
  let transaction = db->IDBDatabase.transaction(objectStoreNames, mode, {durability: durability})

  Js.Promise.make((~resolve, ~reject) => {
    let unit_ = ()
    let eventListeners = ref(None)
    let onRemoveEventListeners = () =>
      removeEventListeners(transaction, IDBTransaction.removeEventListener, eventListeners.contents)

    eventListeners :=
      Some([
        #complete(
          _ => {
            onRemoveEventListeners()
            resolve(. unit_)
          },
        ),
        #error(
          _ => {
            onRemoveEventListeners()
            reject(. IDBTransaction.Error(IDBTransaction.error(transaction)))
            Services_Logger.log("Services_IndexedDB", "transaction error")
          },
        ),
        #abort(
          _ => {
            onRemoveEventListeners()
            reject(. IDBTransaction.Abort)
            Services_Logger.log("Services_IndexedDB", "transaction abort")
          },
        ),
      ])

    let _ = addEventListeners(transaction, IDBTransaction.addEventListener, eventListeners.contents)
    let _ = cb(transaction)
  })
}

module Index = {
  let getAll = (index, keyRange) => {
    let request = IDBIndex.getAll(index, keyRange)

    Js.Promise.make((~resolve, ~reject) => {
      let eventListeners = ref(None)

      eventListeners :=
        Some([
          #success(
            _ => {
              removeEventListeners(request, IDBRequest.removeEventListener, eventListeners.contents)
              switch IDBRequest.result(request) {
              | Some(r) => resolve(. r)
              | None => reject(. IDBRequest.Error(None))
              }
            },
          ),
          #error(
            _ => {
              removeEventListeners(request, IDBRequest.removeEventListener, eventListeners.contents)
              reject(. IDBRequest.Error(IDBRequest.error(request)))
            },
          ),
        ])

      let _ = addEventListeners(request, IDBRequest.addEventListener, eventListeners.contents)
    })
  }
}

let iterateCursor = (~objectStore, ~keyCursor=false, ~onValue, query) => {
  let cursorReq = keyCursor
    ? IDBObjectStore.openKeyCursor(objectStore, query)
    : IDBObjectStore.openCursor(objectStore, query)

  Js.Promise.make((~resolve, ~reject) => {
    let eventListeners = ref(None)

    eventListeners :=
      Some([
        #success(
          _ => {
            let unit_ = ()
            switch (
              cursorReq->IDBRequest.result,
              cursorReq->IDBRequest.result->Belt.Option.flatMap(IDBCursorWithValue.value),
            ) {
            | (Some(result), Some(value)) =>
              let _ = onValue(value)
              let _ = IDBCursorWithValue.continue(result)
            | _ =>
              removeEventListeners(
                cursorReq,
                IDBRequest.removeEventListener,
                eventListeners.contents,
              )
              resolve(. unit_)
            }
          },
        ),
        #error(
          _ => {
            removeEventListeners(cursorReq, IDBRequest.removeEventListener, eventListeners.contents)
            reject(. IDBRequest.Error(IDBRequest.error(cursorReq)))
          },
        ),
      ])
    let _ = addEventListeners(cursorReq, IDBRequest.addEventListener, eventListeners.contents)
  })
}

let openCursor = (~objectStore, ~keyCursor=false, query) => {
  let cursorReq = keyCursor
    ? IDBObjectStore.openKeyCursor(objectStore, query)
    : IDBObjectStore.openCursor(objectStore, query)

  Js.Promise.make((~resolve, ~reject) => {
    let eventListeners = ref(None)

    eventListeners :=
      Some([
        #success(
          _ => {
            removeEventListeners(cursorReq, IDBRequest.removeEventListener, eventListeners.contents)
            switch IDBRequest.result(cursorReq) {
            | Some(r) => resolve(. r)
            | None => reject(. IDBRequest.Error(None))
            }
          },
        ),
        #error(
          _ => {
            removeEventListeners(cursorReq, IDBRequest.removeEventListener, eventListeners.contents)
            reject(. IDBRequest.Error(IDBRequest.error(cursorReq)))
          },
        ),
      ])

    let _ = addEventListeners(cursorReq, IDBRequest.addEventListener, eventListeners.contents)
  })
}
