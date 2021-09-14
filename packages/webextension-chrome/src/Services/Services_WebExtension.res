open Externals.WebExtension

exception ExecuteScript_EmptyResult

let executeScript = (~tabId, ~filePath) =>
  Js.Promise.make((~resolve, ~reject) =>
    Scripting.executeScript(
      {
        target: {tabId: tabId, allFrames: None},
        files: Some([filePath]),
        func: None,
      },
      result => resolve(. result),
    )
  ) |> Js.Promise.then_(result =>
    switch Belt.Array.get(result, 0) {
    | Some(result) => Js.Promise.resolve(result)
    | None => Js.Promise.reject(ExecuteScript_EmptyResult)
    }
  )
