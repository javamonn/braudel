type t

type makeOptions = {charThreshold: int}
type isProbablyReaderableOptions = {minContentLength: int}

type article = {
  title: string,
  content: string,
  textContent: string,
  length: int,
  excerpt: string,
  byline: string,
  dir: string,
  siteName: string,
}

@module("@mozilla/readability") @new
external make: (Webapi.Dom.HtmlDocument.t, makeOptions) => t = "Readability"
@module("@mozilla/readability") @val
external isProbablyReaderable: (Webapi.Dom.HtmlDocument.t, isProbablyReaderableOptions) => bool =
  "isProbablyReaderable"

@send external parse: t => article = "parse"
