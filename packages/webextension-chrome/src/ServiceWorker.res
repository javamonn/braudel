open Externals.WebExtension

Runtime.addOnInstalledListener(_ => {
  let _ = Services.IndexedDB.open_() |> Js.Promise.then_(_db => {
    Services.Logger.log("onInstalledListener", "complete")
    Js.Promise.resolve()
  })
})

WebNavigation.addOnCommittedListener((details: WebNavigation.committedDetails) => {
  open Models
  open Externals.IndexedDB

  let _ = Services.IndexedDB.open_() |> Js.Promise.then_(db => {
    let item = PendingHistoryItem.make(
      ~tabId=details.tabId,
      ~frameId=details.frameId,
      ~processId=details.processId,
      ~createdAt=Js.Date.fromFloat(details.timeStamp),
      ~url=details.url,
      ~transitionType=details.transitionType,
      ~transitionQualifiers=details.transitionQualifiers,
    )
    Services.IndexedDB.transaction(
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
      Services.Logger.log("onCommitted", `handled event: ${details.url}`)
      Js.Promise.resolve()
    })
    |> Js.Promise.catch(error => {
      Services.Logger.error(
        "onCommitted",
        `failed to handle event: ${details.url}`,
        Services.Logger.PromiseError(error),
      )
      Js.Promise.resolve()
    })
  })
})

WebNavigation.addOnDOMContentLoadedListener((
  domContentLoadedDetails: WebNavigation.domContentLoadedDetails,
) => {
  open Models
  open Externals.IndexedDB

  let _ = Js.Promise.all2((
    Services.IndexedDB.open_(),
    Services.WebExtension.executeScript(
      ~tabId=domContentLoadedDetails.tabId,
      ~filePath=Config.injectedScriptGetHistoryDetailsPath,
    ),
  )) |> Js.Promise.then_(((db, historyDetails: Models.InjectedScriptGetHistoryDetailsResult.t)) => {
    let pendingHistoryItemId = PendingHistoryItem.makeId(
      ~tabId=string_of_int(domContentLoadedDetails.tabId),
      ~frameId=string_of_int(domContentLoadedDetails.frameId),
      ~processId=string_of_int(domContentLoadedDetails.processId),
    )

    Services.IndexedDB.transaction(
      ~db,
      ~objectStoreNames=[
        PendingHistoryItem.objectStoreName,
        HistoryItem.objectStoreName,
        FullTextSearchHistoryItem.objectStoreName,
      ],
      ~mode=#readwrite,
      ~durability=#strict,
      transaction => {
        Services.IndexedDB.openCursor(
          ~objectStore=IDBTransaction.objectStore(transaction, PendingHistoryItem.objectStoreName),
          pendingHistoryItemId,
        ) |> Js.Promise.then_((
          pendingHistoryItemCursor: IDBCursorWithValue.t<Models.PendingHistoryItem.t>,
        ) => {
          switch IDBCursorWithValue.value(pendingHistoryItemCursor) {
          | Some(pendingHistoryItem) =>
            let historyItem = Models.HistoryItem.make(
              ~id=Externals.Crypto.randomUUID(),
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
          | None => Js.Promise.reject(Services.IndexedDB.EmptyCursor)
          }
        })
      },
    )
    |> Js.Promise.then_(_ => {
      Services.Logger.log("onDOMContentLoaded", `handled event: ${domContentLoadedDetails.url}`)

      Js.Promise.resolve()
    })
    |> Js.Promise.catch(error => {
      Services.Logger.error(
        "onDOMContentLoaded",
        `failed to handle event: ${domContentLoadedDetails.url}`,
        Services.Logger.PromiseError(error),
      )

      Js.Promise.resolve()
    })
  })
})
