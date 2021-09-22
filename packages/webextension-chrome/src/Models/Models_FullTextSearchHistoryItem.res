type idxBounds = {startIdx: int, len: int}
type segmentContext = [
  | #title
  | #url
  | #textContent
]

@deriving(accessors)
type termMetadata = {
  segmentIndices: array<int>,
  segmentContexts: array<segmentContext>, // terms is a set, so idx may exceed term length and a term may have multiple idx
}

@deriving(accessors)
type t = {
  historyItemId: string,
  createdAt: Js.Date.t,
  terms: array<string>,
  termMetadata: Js.Dict.t<termMetadata>,
}

let buildTerms = (~termMetadata, ~segmentContext, ~segments, terms) =>
  Belt.Array.reduceWithIndex(segments, terms, (
    agg,
    term: Externals.Intl.Segmenter.segment,
    segmentIdx,
  ) => {
    if term.isWordLike {
      let term = term.segment->Js.String.toLowerCase->Externals.Stemmer.stemmer

      let _ = {
        let {segmentContexts, segmentIndices} = Js.Dict.get(
          termMetadata,
          term,
        )->Belt.Option.getWithDefault({
          segmentContexts: [],
          segmentIndices: [],
        })

        Js.Dict.set(
          termMetadata,
          term,
          {
            segmentIndices: Belt.Array.concat(segmentIndices, [segmentIdx]),
            segmentContexts: Belt.Array.concat(segmentContexts, [segmentContext]),
          },
        )
      }

      agg->Belt.Set.String.add(term)
    } else {
      agg
    }
  })

let fromHistoryItem = (historyItem: Models_HistoryItem.t) => {
  let segmenter = Externals.Intl.Segmenter.make(Externals.Navigator.language, {granularity: #word})

  let termMetadata = Js.Dict.empty()
  let terms =
    Belt.Set.String.empty
    ->buildTerms(
      ~termMetadata,
      ~segmentContext=#url,
      ~segments=segmenter->Externals.Intl.Segmenter.segment(historyItem.url)->Js.Array.from,
    )
    ->buildTerms(
      ~termMetadata,
      ~segmentContext=#title,
      ~segments=segmenter->Externals.Intl.Segmenter.segment(historyItem.title)->Js.Array.from,
    )
    ->buildTerms(
      ~termMetadata,
      ~segmentContext=#textContent,
      ~segments=segmenter->Externals.Intl.Segmenter.segment(historyItem.textContent)->Js.Array.from,
    )
    ->Belt.Set.String.toArray

  {
    historyItemId: historyItem.id,
    createdAt: Js.Date.make(),
    terms: terms,
    termMetadata: termMetadata,
  }
}

let objectStoreName = "fullTextSearchHistoryItems"
let termsIndexName = "terms"
