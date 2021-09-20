open Externals
open Webapi.Dom

let getTextContent = document => {
  if Readability.isProbablyReaderable(document, {minContentLength: 50}) {
    let article = document->Readability.make({charThreshold: 50})->Readability.parse
    article.textContent
  } else {
    let treeWalker = Document.createTreeWalkerWithWhatToShowFilter(
      HtmlDocument.asDocument(document),
      document->HtmlDocument.documentElement,
      WhatToShow._Text,
      NodeFilter.make(node => {
        if Element.nodeType(node) != Text {
          WebapiExtension.NodeFilter.filterSkip
        } else {
          node
          ->Element.parentElement
          ->Belt.Option.map(elem => {
            let style = Window.getComputedStyle(window, elem)
            let visibility = CssStyleDeclaration.getPropertyValue(style, "visibility")

            if CssStyleDeclaration.getPropertyValue(style, "display") == "none" {
              WebapiExtension.NodeFilter.filterReject
            } else if Js.String2.length(visibility) > 0 && visibility != "visible" {
              WebapiExtension.NodeFilter.filterReject
            } else if (
              style
              ->CssStyleDeclaration.getPropertyValue("opacity")
              ->float_of_string_opt
              ->Belt.Option.getWithDefault(1.0) < 0.1
            ) {
              WebapiExtension.NodeFilter.filterReject
            } else {
              WebapiExtension.NodeFilter.filterAccept
            }
          })
          ->Belt.Option.getWithDefault(WebapiExtension.NodeFilter.filterReject)
        }
      }),
    )

    let textContents = ref([])
    let currentNode = ref(TreeWalker.nextNode(treeWalker))

    while Js.Option.isSome(currentNode.contents) {
      let textContent =
        currentNode.contents->Belt.Option.map(Node.textContent)->Belt.Option.getWithDefault("")
      let _ = Js.Array2.push(textContents.contents, textContent)
      currentNode := TreeWalker.nextNode(treeWalker)
    }

    textContents.contents
    ->Belt.Array.joinWith("", i => i)
    ->Js.String2.replaceByRe(%re("/\|\|\|\|\|/g"), "\n")
    ->Js.String2.replaceByRe(
      Js.Re.fromStringWithFlags("(\n\u00A0|\u00A0\n|\n | \n)+", ~flags="g"),
      "\n",
    )
    ->Js.String2.replaceByRe(
      Js.Re.fromStringWithFlags("(\r\u00A0|\u00A0\r|\r | \r)+", ~flags="g"),
      "\n",
    )
    ->Js.String2.replaceByRe(
      Js.Re.fromStringWithFlags("(\v\u00A0|\u00A0\v|\v | \v)+", ~flags="g"),
      "\n",
    )
    ->Js.String2.replaceByRe(
      Js.Re.fromStringWithFlags("(\t\u00A0|\u00A0\t|\t | \t)+", ~flags="g"),
      "\n",
    )
    ->Js.String2.replaceByRe(Js.Re.fromStringWithFlags("[\n\r\t\v]+", ~flags="g"), "\n")
    ->Js.String2.unsafeReplaceBy2(Js.Re.fromStringWithFlags("(\n[\s]+)(\S)", ~flags="gm"), (
      _matchPart,
      _whitespaceGroup,
      nonWhitespaceGroup,
      matchIdx,
      _whole,
    ) => matchIdx == 0 ? nonWhitespaceGroup : "\n" ++ nonWhitespaceGroup)
    ->Js.String2.unsafeReplaceBy2(Js.Re.fromStringWithFlags("(\S)([\s]+\n)", ~flags="gm"), (
      _matchPart,
      nonWhitespaceGroup,
      _whitespaceGroup,
      _matchIdx,
      _whole,
    ) => nonWhitespaceGroup ++ "\n")
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
      rels->Belt.Array.map(rel => `link[rel="${rel}"]`)->Belt.Array.joinWith(", ", i => i),
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

  Models.InjectedScriptGetHistoryDetailsResult.make(
    ~textContent=getTextContent(documentClone),
    ~faviconUrl=getFaviconUrl(documentClone),
    ~title=HtmlDocument.title(documentClone),
  )
}
