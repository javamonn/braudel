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
module IDBRequest = {
  type t<'a>
  exception Error(option<Js.Exn.t>)
  @send
  external addEventListener: (
    t<'a>,
    @string
    [
      | #success(Dom.event => unit)
      | #error(Dom.event => unit)
    ],
  ) => unit = "addEventListener"
  @send
  external removeEventListener: (
    t<'a>,
    @string
    [
      | #success(Dom.event => unit)
      | #error(Dom.event => unit)
    ],
  ) => unit = "removeEventListener"

  @get external result: t<'a> => option<'a> = "result"
  @get external error: t<'a> => option<Js.Exn.t> = "error"
}

// https://developer.mozilla.org/en-US/docs/Web/API/IDBIndex
module IDBIndex = {
  type t
}

// https://developer.mozilla.org/en-US/docs/Web/API/IDBCursorWithValue
module IDBCursorWithValue = {
  type t<'a>

  @get external value: t<'a> => option<'a> = "value"
  @send external delete: t<'a> => IDBRequest.t<unit> = "delete"
}

// https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore
module IDBObjectStore = {
  type t<'a>
  type objectParameters = {
    unique: option<bool>,
    multiEntry: option<bool>,
  }

  @send
  external createIndex: (t<'a>, string, string, option<objectParameters>) => IDBIndex.t =
    "createIndex"
  @send external add: (t<'a>, StructuredClonable.t<'a>) => IDBRequest.t<unit> = "add"
  @send external put: (t<'a>, StructuredClonable.t<'a>) => IDBRequest.t<unit> = "put"
  @send
  external openCursor: (t<'a>, string) => IDBRequest.t<IDBCursorWithValue.t<'a>> = "openCursor"
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
  @send
  external removeEventListener: (
    t,
    @string
    [
      | #complete(Dom.event => unit)
      | #error(Dom.event => unit)
      | #abort(Dom.event => unit)
    ],
  ) => unit = "removeEventListener"

  @send external objectStore: (t, string) => IDBObjectStore.t<'a> = "objectStore"
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
  external createObjectStore: (t, string, option<createObjectStoreParams>) => IDBObjectStore.t<'a> =
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
  type t = IDBDatabase.t
  exception Error(option<Js.Exn.t>)

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

  @send
  external removeEventListener: (
    t,
    @string
    [
      | #success(Event.success => unit)
      | #error(Event.error => unit)
      | #blocked(Event.blocked => unit)
      | #upgradeneeded(Event.versionChange => unit)
    ],
  ) => unit = "removeEventListener"

  @get external result: t => option<t> = "result"
  @get external error: t => option<Js.Exn.t> = "error"
}

// https://developer.mozilla.org/en-US/docs/Web/API/IDBFactory
module IDBFactory = {
  @scope("indexedDB") @val external open_: (string, option<int>) => IDBOpenDBRequest.t = "open"
}
