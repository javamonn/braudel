type queryResult = {
  fullTextSearchHistoryItem: Models.FullTextSearchHistoryItem.t,
  matchedTerms: Belt.Set.String.t,
}

let getFullTextHistoryItemsForTerms = terms => {
  open Externals.IndexedDB

  Services_IndexedDB.open_() |> Js.Promise.then_(db => {
    let results = ref(Belt.Map.String.empty)

    Services_IndexedDB.transaction(
      ~db,
      ~objectStoreNames=[Models.FullTextSearchHistoryItem.objectStoreName],
      ~mode=#readonly,
      ~durability=#relaxed,
      tx => {
        let index =
          tx
          ->IDBTransaction.objectStore(Models.FullTextSearchHistoryItem.objectStoreName)
          ->IDBObjectStore.index(Models.FullTextSearchHistoryItem.termsIndexName)

        terms
        ->Belt.Set.String.toArray
        ->Belt.Array.map(queryTerm =>
          Services_IndexedDB.Index.getAll(
            index,
            IDBKeyRange.only(queryTerm),
          ) |> Js.Promise.then_((
            fullTextSearchHistoryItemResults: array<Models.FullTextSearchHistoryItem.t>,
          ) => {
            results :=
              fullTextSearchHistoryItemResults->Belt.Array.reduce(results.contents, (
                memo,
                result,
              ) => {
                Belt.Map.String.update(memo, result.historyItemId, existingValue => {
                  let existingMatchedTerms = switch existingValue {
                  | None => Belt.Set.String.empty
                  | Some({matchedTerms}) => matchedTerms
                  }

                  Some({
                    fullTextSearchHistoryItem: result,
                    matchedTerms: existingMatchedTerms->Belt.Set.String.add(queryTerm),
                  })
                })
              })
            Js.Promise.resolve()
          })
        )
      },
    ) |> Js.Promise.then_(_ => Js.Promise.resolve(results.contents))
  })
}

let fulltext = query => {
  let segmenter = Externals.Intl.Segmenter.make(Externals.Navigator.language, {granularity: #word})
  let queryTerms =
    segmenter
    ->Externals.Intl.Segmenter.segment(query)
    ->Js.Array.from
    ->Belt.Array.reduce(Belt.Set.String.empty, (memo, term) => {
      if term.isWordLike {
        let term = term.segment->Js.String.toLowerCase->Externals.Stemmer.stemmer
        Belt.Set.String.add(memo, term)
      } else {
        memo
      }
    })

  getFullTextHistoryItemsForTerms(queryTerms) |> Js.Promise.then_(results =>
    results
    ->Belt.Map.String.valuesToArray
    ->Belt.Array.map(queryResult => (
      Service_Search_ResultAnalyzer.getResultMetadata(
        ~queryTerms,
        ~matchedTerms=queryResult.matchedTerms,
        ~fullTextSearchHistoryItem=queryResult.fullTextSearchHistoryItem,
      ),
      queryResult,
    ))
    ->Belt.SortArray.stableSortBy(((scoreA, _), (scoreB, _)) => {
      if scoreA > scoreB {
        -1
      } else if scoreA < scoreB {
        1
      } else {
        0
      }
    })
    ->Belt.Array.map(((_, result)) => result)
    ->Js.Promise.resolve
  )
}
