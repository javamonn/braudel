type t = {
  id: string,
  createdAt: Js.Date.t,
  textContent: string,
  title: string,
  url: string,
  favicon: Webapi.Blob.t,
  transitionType: Externals.WebExtension.WebNavigation.transitionType,
  transitionQualifiers: array<Externals.WebExtension.WebNavigation.transitionQualifier>,
  tabId: int,
  frameId: int,
  processId: int,
}

let objectStoreName = "historyItems"

let make = (
  ~id,
  ~createdAt,
  ~textContent,
  ~title,
  ~url,
  ~favicon,
  ~transitionType,
  ~transitionQualifiers,
  ~tabId,
  ~frameId,
  ~processId,
) => {
  id: id,
  createdAt: createdAt,
  textContent: textContent,
  title: title,
  url: url,
  favicon: favicon,
  transitionType: transitionType,
  transitionQualifiers: transitionQualifiers,
  tabId: tabId,
  frameId: frameId,
  processId: processId,
}
