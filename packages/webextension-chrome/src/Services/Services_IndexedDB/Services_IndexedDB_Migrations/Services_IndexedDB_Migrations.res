exception InvalidMigrationVersion

let registry: array<Externals_IndexedDB.IDBDatabase.t => unit> = [Migration_1_Init.up]
let currentVersion = Belt.Array.length(registry)

let execute = (~currentVersion, ~targetVersion, db) => {
  Services_Logger.log(
    "Services_IndexedDB_Migrations.execute",
    {"currentVersion": currentVersion, "targetVersion": targetVersion},
  )

  if currentVersion >= targetVersion || targetVersion > Belt.Array.length(registry) {
    Belt.Result.Error(InvalidMigrationVersion)
  } else {
    let _ =
      registry
      ->Belt.Array.slice(~offset=currentVersion, ~len=targetVersion - currentVersion)
      ->Belt.Array.forEach(op => op(db))

    Belt.Result.Ok()
  }
}
