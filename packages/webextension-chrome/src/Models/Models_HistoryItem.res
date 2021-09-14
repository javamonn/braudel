type t = {
  id: string,
  createdAt: Js.Date.t,
  textContent: string,
  title: string,
  url: Webapi.Url.t,
  favicon: Webapi.Blob.t,
  transitionType: Externals.WebExtension.WebNavigation.transitionType,
  transitionQualifiers: array<Externals.WebExtension.WebNavigation.transitionQualifier>,
  tabId: int,
  frameId: int,
  processId: int,
}
