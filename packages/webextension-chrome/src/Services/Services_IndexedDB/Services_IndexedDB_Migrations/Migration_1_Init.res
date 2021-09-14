let up = db => {
  open Externals.IndexedDB
  let _ = IDBDatabase.createObjectStore(
    db,
    "historyItems",
    Some({IDBDatabase.keyPath: Some("id"), autoIncrement: None}),
  )
  let _ = IDBDatabase.createObjectStore(
    db,
    "pendingHistoryItems",
    Some({IDBDatabase.keyPath: Some("id"), autoIncrement: None}),
  )
  let fullTextHistoryItemsStore = IDBDatabase.createObjectStore(
    db,
    "fullTextSearchHistoryItems",
    Some({IDBDatabase.keyPath: Some("historyItemId"), autoIncrement: None}),
  )
  let _ = IDBObjectStore.createIndex(
    fullTextHistoryItemsStore,
    "terms",
    "terms",
    Some({IDBObjectStore.unique: None, multiEntry: Some(true)}),
  )
}
