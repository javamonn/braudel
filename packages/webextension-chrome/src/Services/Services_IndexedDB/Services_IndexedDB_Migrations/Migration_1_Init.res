let up = db => {
  open Externals.IndexedDB
  let _ = IDBDatabase.createObjectStore(
    db,
    Models.HistoryItem.objectStoreName,
    Some({IDBDatabase.keyPath: Some("id"), autoIncrement: None}),
  )
  let _ = IDBDatabase.createObjectStore(
    db,
    Models.PendingHistoryItem.objectStoreName,
    Some({IDBDatabase.keyPath: Some("id"), autoIncrement: None}),
  )
  let fullTextHistoryItemsStore = IDBDatabase.createObjectStore(
    db,
    Models.FullTextSearchHistoryItem.objectStoreName,
    Some({IDBDatabase.keyPath: Some("historyItemId"), autoIncrement: None}),
  )
  let _ = IDBObjectStore.createIndex(
    fullTextHistoryItemsStore,
    Models.FullTextSearchHistoryItem.termsIndexName,
    "terms",
    Some({IDBObjectStore.unique: None, multiEntry: Some(true)}),
  )
}
