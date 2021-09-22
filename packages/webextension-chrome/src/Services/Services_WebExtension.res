open Externals.WebExtension

exception ExecuteScript_EmptyResult

let executeScript = (~tabId, ~filePath) => {
  open Scripting

  Js.Promise.make((~resolve, ~reject) =>
    executeScript(
      scriptInjection(~target=injectionTarget(~tabId, ()), ~files=[filePath], ()),
      result => resolve(. result),
    )
  ) |> Js.Promise.then_(result =>
    switch result
    ->Belt.Array.get(0)
    ->Belt.Option.flatMap(result => Js.Nullable.toOption(result.result)) {
    | Some(result) => Js.Promise.resolve(result)
    | None => Js.Promise.reject(ExecuteScript_EmptyResult)
    }
  )
}

let handleInstalled = () => {
  Services_Logger.log("Services_WebExtension", "handleInstalled begin")
  let _ = Services_IndexedDB.open_() |> Js.Promise.then_(_db => {
    Services_Logger.log("handleInstalled", "complete")
    Js.Promise.resolve()
  })
}

let handleNavigationCommitted = (details: WebNavigation.committedDetails) => {
  open Models
  open Externals.IndexedDB

  Services_Logger.logWithDetails(
    "Services_WebExtension",
    "handleNavigationCommitted begin",
    details,
  )

  let _ = Services_IndexedDB.open_() |> Js.Promise.then_(db => {
    let item = PendingHistoryItem.make(
      ~tabId=details.tabId,
      ~frameId=details.frameId,
      ~processId=details.processId,
      ~createdAt=Js.Date.fromFloat(details.timeStamp),
      ~url=details.url,
      ~transitionType=details.transitionType,
      ~transitionQualifiers=details.transitionQualifiers,
    )
    Services_IndexedDB.transaction(
      ~db,
      ~objectStoreNames=[PendingHistoryItem.objectStoreName],
      ~mode=#readwrite,
      ~durability=#relaxed,
      transaction => {
        let _ =
          transaction
          ->IDBTransaction.objectStore(PendingHistoryItem.objectStoreName)
          ->IDBObjectStore.add(StructuredClonable.make(item))
      },
    )
    |> Js.Promise.then_(_ => {
      Services_Logger.log("Services_WebExtension", "handleNavigationCommitted success")
      Js.Promise.resolve()
    })
    |> Js.Promise.catch(error => {
      Services_Logger.error(
        "Services_WebExtension",
        "handleNavigationCommitted failed",
        Services_Logger.PromiseError(error),
      )
      Js.Promise.resolve()
    })
  })
}

let handleNavigationDOMContentLoaded = (
  domContentLoadedDetails: WebNavigation.domContentLoadedDetails,
) => {
  open Models
  open Externals.IndexedDB

  Services_Logger.logWithDetails(
    "Services_WebExtension",
    "handleNavigationDOMContentLoaded begin",
    domContentLoadedDetails,
  )

  let _ =
    Js.Promise.all2((
      Services_IndexedDB.open_(),
      executeScript(
        ~tabId=domContentLoadedDetails.tabId,
        ~filePath=Config.injectedScriptGetHistoryDetailsPath,
      ),
    ))
    |> Js.Promise.then_(((db, historyDetails: Models.InjectedScriptGetHistoryDetailsResult.t)) => {
      let pendingHistoryItemId = PendingHistoryItem.makeId(
        ~tabId=string_of_int(domContentLoadedDetails.tabId),
        ~frameId=string_of_int(domContentLoadedDetails.frameId),
        ~processId=string_of_int(domContentLoadedDetails.processId),
      )

      Services_IndexedDB.transaction(
        ~db,
        ~objectStoreNames=[
          PendingHistoryItem.objectStoreName,
          HistoryItem.objectStoreName,
          FullTextSearchHistoryItem.objectStoreName,
        ],
        ~mode=#readwrite,
        ~durability=#strict,
        transaction => {
          Services_IndexedDB.openCursor(
            ~objectStore=IDBTransaction.objectStore(
              transaction,
              PendingHistoryItem.objectStoreName,
            ),
            IDBKeyRange.only(pendingHistoryItemId),
          ) |> Js.Promise.then_((
            pendingHistoryItemCursor: IDBCursorWithValue.t<Models.PendingHistoryItem.t>,
          ) => {
            switch IDBCursorWithValue.value(pendingHistoryItemCursor) {
            | Some(pendingHistoryItem) =>
              let historyItem = Models.HistoryItem.make(
                ~id=Externals.UUID.makeV4(),
                ~createdAt=Js.Date.make(),
                ~textContent=historyDetails.textContent,
                ~title=historyDetails.title,
                ~url=domContentLoadedDetails.url,
                ~faviconUrl=historyDetails.faviconUrl,
                ~transitionType=pendingHistoryItem.transitionType,
                ~transitionQualifiers=pendingHistoryItem.transitionQualifiers,
                ~tabId=domContentLoadedDetails.tabId,
                ~frameId=domContentLoadedDetails.frameId,
                ~processId=domContentLoadedDetails.processId,
              )
              let fullTextSearchHistoryItem = Models.FullTextSearchHistoryItem.fromHistoryItem(
                historyItem,
              )

              let _ =
                transaction
                ->IDBTransaction.objectStore(Models.HistoryItem.objectStoreName)
                ->IDBObjectStore.add(StructuredClonable.make(historyItem))
              let _ =
                transaction
                ->IDBTransaction.objectStore(Models.FullTextSearchHistoryItem.objectStoreName)
                ->IDBObjectStore.add(StructuredClonable.make(fullTextSearchHistoryItem))
              let _ = IDBCursorWithValue.delete(pendingHistoryItemCursor)

              Js.Promise.resolve()
            | None => Js.Promise.reject(Services_IndexedDB.EmptyCursor)
            }
          })
        },
      )
    })
    |> Js.Promise.then_(_ => {
      Services_Logger.log("Services_WebExtension", "handleNavigationDOMContentLoaded success")

      Js.Promise.resolve()
    })
    |> Js.Promise.catch(error => {
      Services_Logger.error(
        "Services_WebExtension",
        "handleNavigationDOMContentLoaded failed",
        Services_Logger.PromiseError(error),
      )

      Js.Promise.resolve()
    })
}
