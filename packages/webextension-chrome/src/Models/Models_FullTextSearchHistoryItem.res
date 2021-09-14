type idxBounds = {startIdx: int, len: int}

type t = {
  historyItemId: string,
  createdAt: Js.Date.t,
  urlTermBounds: idxBounds,
  textContentTermBounds: idxBounds,
  titleTermBounds: idxBounds,
  terms: array<string>,
}

let addTerms = (termsRef, segments) => {
  let startIdx = Belt.Set.String.size(termsRef.contents)
  termsRef :=
    Belt.Array.reduce(segments, termsRef.contents, (
      agg,
      term: Externals.Intl.Segmenter.segment,
    ) => {
      if term.isWordLike {
        let term = term.segment->Js.String.toLowerCase->Externals.Stemmer.stemmer
        agg->Belt.Set.String.add(term)
      } else {
        agg
      }
    })

  {
    startIdx: startIdx,
    len: Belt.Set.String.size(termsRef.contents) - startIdx,
  }
}

let fromHistoryItem = (historyItem: Models_HistoryItem.t) => {
  let segmenter = Externals.Intl.Segmenter.make(Externals.Navigator.language, {granularity: #word})

  let terms = ref(Belt.Set.String.empty)
  let urlTermBounds = addTerms(
    terms,
    segmenter->Externals.Intl.Segmenter.segment(historyItem.url)->Js.Array.from,
  )
  let titleTermBounds = addTerms(
    terms,
    segmenter->Externals.Intl.Segmenter.segment(historyItem.title)->Js.Array.from,
  )
  let textContentTermBounds = addTerms(
    terms,
    segmenter->Externals.Intl.Segmenter.segment(historyItem.textContent)->Js.Array.from,
  )

  {
    historyItemId: historyItem.id,
    createdAt: Js.Date.make(),
    terms: Belt.Set.String.toArray(terms.contents),
    urlTermBounds: urlTermBounds,
    titleTermBounds: titleTermBounds,
    textContentTermBounds: textContentTermBounds,
  }
}

let objectStoreName = "fullTextSearchHistoryItems"
