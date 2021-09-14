module Event = {
  type success = {@as("type") type_: string}
  type error = {@as("type") type_: string}
  type blocked = Dom.event
  type versionChange = {@as("type") type_: string, oldVersion: int, newVersion: int}
}
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
module StructuredClonable = {
  type t<'a>
  external make: 'a => t<'a> = "%identity"
  external unwrap: t<'a> => 'a = "%identity"
}

// https://developer.mozilla.org/en-US/docs/Web/API/IDBRequest
module MakeIDBRequest = (
  Config: {
    type resultType
  },
) => {
  type t
  exception Error(option<Js.Exn.t>)
  @send
  external addEventListener: (
    t,
    @string
    [
      | #success(Dom.event => unit)
      | #error(Dom.event => unit)
    ],
  ) => unit = "addEventListener"

  @get external result: t => option<Config.resultType> = "result"
  @get external error: t => option<Js.Exn.t> = "error"
}

// https://developer.mozilla.org/en-US/docs/Web/API/IDBIndex
module IDBIndex = {
  type t
}

// https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore
module IDBObjectStore = {
  type t
  type objectParameters = {
    unique: option<bool>,
    multiEntry: option<bool>,
  }
  module AddIDBRequest = MakeIDBRequest({
    type resultType = unit
  })
  module PutIDBRequest = MakeIDBRequest({
    type resultType = unit
  })

  @send
  external createIndex: (t, string, string, option<objectParameters>) => IDBIndex.t = "createIndex"
  @send external add: (t, StructuredClonable.t<'a>) => AddIDBRequest.t = "add"
  @send external put: (t, StructuredClonable.t<'a>) => PutIDBRequest.t = "put"
}

// https://developer.mozilla.org/en-US/docs/Web/API/IDBTransaction
module IDBTransaction = {
  type t

  exception Error(option<Js.Exn.t>)
  exception Abort

  @send
  external addEventListener: (
    t,
    @string
    [
      | #complete(Dom.event => unit)
      | #error(Dom.event => unit)
      | #abort(Dom.event => unit)
    ],
  ) => unit = "addEventListener"

  @send external objectStore: (t, string) => IDBObjectStore.t = "objectStore"
  @get external error: t => option<Js.Exn.t> = "error"
}

// https://developer.mozilla.org/en-US/docs/Web/API/IDBDatabase
module IDBDatabase = {
  type t
  type createObjectStoreParams = {
    keyPath: option<string>,
    autoIncrement: option<bool>,
  }
  type transactionMode = [
    | #readonly
    | #readwrite
  ]
  type transactionDurability = [
    | #default
    | #relaxed
    | #strict
  ]
  type transactionOptions = {durability: transactionDurability}

  @get external name: t => string = "name"
  @get external version: t => int = "version"
  @send
  external createObjectStore: (t, string, option<createObjectStoreParams>) => IDBObjectStore.t =
    "createObjectStore"

  @send
  external transaction: (
    t,
    array<string>,
    transactionMode,
    transactionOptions,
  ) => IDBTransaction.t = "transaction"
}

// https://developer.mozilla.org/en-US/docs/Web/API/IDBOpenDBRequest
module IDBOpenDBRequest = {
  include MakeIDBRequest({
    type resultType = IDBDatabase.t
  })

  @send
  external addEventListener: (
    t,
    @string
    [
      | #success(Event.success => unit)
      | #error(Event.error => unit)
      | #blocked(Event.blocked => unit)
      | #upgradeneeded(Event.versionChange => unit)
    ],
  ) => unit = "addEventListener"
}

// https://developer.mozilla.org/en-US/docs/Web/API/IDBFactory
module IDBFactory = {
  @scope("indexedDB") @val external open_: (string, option<int>) => IDBOpenDBRequest.t = "open"
}
