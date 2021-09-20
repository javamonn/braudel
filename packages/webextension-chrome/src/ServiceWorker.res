open Externals.WebExtension

Runtime.addOnInstalledListener(_ => {
  Services.WebExtension.handleInstalled()
})

WebNavigation.addOnCommittedListener(committedDetails => {
  if committedDetails.frameId == 0 {
    Services.WebExtension.handleNavigationCommitted(committedDetails)
  }
})

WebNavigation.addOnDOMContentLoadedListener(domContentLoadedDetails => {
  if domContentLoadedDetails.frameId == 0 {
    Services.WebExtension.handleNavigationDOMContentLoaded(domContentLoadedDetails)
  }
})
