import initSqlJs from "@jlongster/sql.js";
import { SQLiteFS } from "absurd-sql";
import IndexedDBBackend from "absurd-sql/dist/indexeddb-backend";
import { initBackend } from "absurd-sql/dist/indexeddb-main-thread";

const exec = () => {
  console.log('init start')
  const initPromise = initSqlJs({ locateFile: (file) => file })
    .then((SQL) => {
      console.log("initSqlJs");
      const sqlFS = new SQLiteFS(SQL.FS, new IndexedDBBackend());
      SQL.register_for_idb(sqlFS);
      console.log("register for idb");

      SQL.FS.mkdir("/sql");
      console.log("mkdir");
      SQL.FS.mount(sqlFS, {}, "/sql");
      console.log("mount");

      let db = new SQL.Database("/sql/db.sqlite", { filename: true });
      console.log("new db");
      // You might want to try `PRAGMA page_size=8192;` too!
      db.exec(`
          PRAGMA journal_mode=MEMORY;
        `);

      console.log("sql init complete");
    })
    .catch((err) => {
      console.error("sql init error", err);
    });
  console.log("self", self)
  initBackend(self);

  return initPromise;
};

chrome.runtime.onInstalled.addListener(() => {
  exec();
});

globalThis.exec = exec
