open Externals
open Webapi.Dom

let getTextContent = document => {
  if Readability.isProbablyReaderable(document, {minContentLength: 50}) {
    let article = document->Readability.make({charThreshold: 50})->Readability.parse
    article.textContent
  } else {
    ""
  }
}

let getFaviconUrl = document => {
  let rels = ["apple-touch-icon", "shortcut icon", "icon"]

  let nodeHasRel = (node, rel) =>
    node
    ->Element.ofNode
    ->Belt.Option.flatMap(elem => elem->Element.getAttribute("rel"))
    ->Belt.Option.map(r => Js.String2.includes(r, rel))
    ->Belt.Option.getWithDefault(false)

  let links =
    document
    ->HtmlDocument.head
    ->Element.querySelectorAll(
      rels->Belt.Array.reduce("", (memo, rel) => `${memo}, link[rel="${rel}"]`),
    )
    ->NodeList.toArray
    ->Belt.SortArray.stableSortBy((nodeA, nodeB) => {
      let idxA =
        rels->Belt.Array.getIndexBy(rel => nodeHasRel(nodeA, rel))->Belt.Option.getWithDefault(0)
      let idxB =
        rels->Belt.Array.getIndexBy(rel => nodeHasRel(nodeB, rel))->Belt.Option.getWithDefault(0)
      idxB - idxA
    })

  links
  ->Belt.Array.get(0)
  ->Belt.Option.flatMap(link => link->Element.ofNode)
  ->Belt.Option.flatMap(link => link->Element.getAttribute("href"))
  ->Belt.Option.getWithDefault(window->Window.location->Location.origin ++ "/favicon.ico")
}

let default = (): Models.InjectedScriptGetHistoryDetailsResult.t => {
  let documentClone =
    window->Window.document->Document.asHtmlDocument->Belt.Option.getExn->HtmlDocument.cloneNodeDeep

  let textContent = getTextContent(documentClone)
  let title = HtmlDocument.title(documentClone)
  let faviconUrl = getFaviconUrl(documentClone)
}
