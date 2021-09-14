type t = {
  id: string,
  tabId: int,
  frameId: int,
  processId: int,
  createdAt: Js.Date.t,
  url: string,
  transitionType: Externals.WebExtension.WebNavigation.transitionType,
  transitionQualifiers: array<Externals.WebExtension.WebNavigation.transitionQualifier>,
}

let objectStoreName = "pendingHistoryItems"

let makeId = (~tabId, ~frameId, ~processId) => `${processId}.${tabId}.${frameId}`
let make = (
  ~tabId,
  ~frameId,
  ~processId,
  ~createdAt,
  ~url,
  ~transitionType,
  ~transitionQualifiers,
) => {
  id: makeId(
    ~tabId=string_of_int(tabId),
    ~frameId=string_of_int(frameId),
    ~processId=string_of_int(processId),
  ),
  tabId: tabId,
  frameId: frameId,
  processId: processId,
  createdAt: createdAt,
  url: url,
  transitionType: transitionType,
  transitionQualifiers: transitionQualifiers,
}
