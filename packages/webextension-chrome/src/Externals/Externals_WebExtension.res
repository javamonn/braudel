module Runtime = {
  type installDetails = {
    id: option<string>,
    previousVersion: option<string>,
    reason: string, // install, update, chrome_update, shared_module_update
  }

  @scope(("chrome", "runtime", "onInstalled")) @val
  external addOnInstalledListener: (installDetails => unit) => unit = "addListener"
}

module WebNavigation = {
  type transitionType = [
    | #link
    | #typed
    | #auto_bookmark
    | #auto_subframe
    | #manual_subframe
    | #generated
    | #start_page
    | #form_submit
    | #reload
    | #keyword
    | #keyword_genrated
  ]
  type transitionQualifier = [
    | #client_redirect
    | #server_redirect
    | #forward_back
    | #from_address_bar
  ]
  type committedDetails = {
    frameId: int,
    parentFrameId: int,
    processId: int,
    tabId: int,
    timeStamp: float,
    transitionQualifiers: array<transitionQualifier>,
    transitionType: transitionType,
    url: string,
  }

  type domContentLoadedDetails = {
    frameId: int,
    parentFrameId: int,
    processId: int,
    tabId: int,
    timeStamp: float,
    url: string,
  }

  @scope(("chrome", "webNavigation", "onCommitted")) @val
  external addOnCommittedListener: (committedDetails => unit) => unit = "addListener"
  @scope(("chrome", "webNavigation", "onDOMContentLoaded")) @val
  external addOnDOMContentLoadedListener: (domContentLoadedDetails => unit) => unit = "addListener"
}

module Scripting = {
  type injectionTarget = {
    tabId: int,
    allFrames: option<bool>,
  }
  type scriptInjection<'a, 'b> = {
    target: injectionTarget,
    files: option<array<string>>,
    func: option<'a => 'b>,
  }

  @scope(("chrome", "scripting")) @val
  external executeScript: (scriptInjection<'a, 'b>, array<'c> => unit) => unit = "executeScript"
}
