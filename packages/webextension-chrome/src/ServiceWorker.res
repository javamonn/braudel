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
    ) |> Js.Promise.then_(_ => {
      Services.Logger.log("onCommitted", item)
      Js.Promise.resolve()
    })
  })
})



WebNavigation.addOnDOMContentLoadedListener((details: WebNavigation.domContentLoadedDetails) => {

})
