type resultMetadata = {
  score: float,
  termSegmentIndices: array<int>,
}

let getColocationScore = indices => {
  let sortedIndexes = indices->Belt.SortArray.Int.stableSort
  let distanceScore =
    switch (
      sortedIndexes->Belt.Array.get(0),
      sortedIndexes->Belt.Array.get(Belt.Array.length(sortedIndexes) - 1),
    ) {
    | (Some(lowIdx), Some(highIdx)) => Some(highIdx - lowIdx)
    | _ => None
    }
    ->Belt.Option.map(distance =>
      sortedIndexes->Belt.Array.length->float_of_int /. distance->float_of_int
    )
    ->Belt.Option.getWithDefault(0.0)

  let ascenderScore = {
    let modifier = 1.0 /. Belt.Float.fromInt(Js.Math.max_int(Belt.Array.length(indices) - 1, 1))
    indices->Belt.Array.reduceWithIndex(0.0, (score, index, i) => {
      switch indices->Belt.Array.get(i + 1) {
      | None if Js.Array2.length(indices) == 1 => 1.0
      | None => score
      | Some(nextSiblingIndex) =>
        if nextSiblingIndex < index {
          score
        } else {
          modifier /. Belt.Float.fromInt(nextSiblingIndex - index)
        }
      }
    })
  }

  let scores = [(distanceScore, 1.0), (ascenderScore, 1.0)]
  let totalWeight = scores->Belt.Array.reduce(0.0, (sum, (_, weight)) => sum +. weight)

  Belt.Array.reduce(scores, 0.0, (sum, (score, weight)) => sum +. score *. (weight /. totalWeight))
}

let getMatchScore = (~matchedTerms, ~queryTerms) =>
  matchedTerms->Belt.Set.String.size->float_of_int /. queryTerms->Belt.Set.String.size->float_of_int

let getContextScore = (
  ~matchedTerms,
  ~termSegmentIndices,
  ~fullTextSearchHistoryItem: Models.FullTextSearchHistoryItem.t,
) => {
  let modifier = 1.0 /. matchedTerms->Belt.Set.String.size->float_of_int

  matchedTerms
  ->Belt.Set.String.toArray
  ->Belt.Array.reduceWithIndex(0.0, (score, matchedTerm, matchedTermIdx) => {
    let termSegmentIdx = termSegmentIndices->Belt.Array.get(matchedTermIdx)->Belt.Option.getExn
    let segmentContext =
      fullTextSearchHistoryItem
      ->Models.FullTextSearchHistoryItem.termMetadata
      ->Js.Dict.get(matchedTerm)
      ->Belt.Option.flatMap(termMetadata =>
        termMetadata
        ->Models.FullTextSearchHistoryItem.segmentIndices
        ->Belt.Array.getBy(segmentIdx => segmentIdx == termSegmentIdx)
        ->Belt.Option.flatMap(segmentIndicesIndex =>
          termMetadata
          ->Models.FullTextSearchHistoryItem.segmentContexts
          ->Belt.Array.get(segmentIndicesIndex)
        )
      )
      ->Belt.Option.getWithDefault(#textContent)

    switch segmentContext {
    | #title | #url => score +. modifier
    | #textContent => score
    }
  })
}

let getColocationScore = (~matchedTerms, ~fullTextSearchHistoryItem) => {
  let matchedTermsResultIndexes =
    matchedTerms
    ->Belt.Set.String.toArray
    ->Belt.Array.map(matchedTerm =>
      fullTextSearchHistoryItem
      ->Models.FullTextSearchHistoryItem.termMetadata
      ->Js.Dict.get(matchedTerm)
      ->Belt.Option.getExn
      ->Models.FullTextSearchHistoryItem.segmentIndices
    )

  let permutations = matchedTermsResultIndexes->Belt.Array.reduce([[]], (
    memo: array<array<int>>,
    indexes: array<int>,
  ) => {
    memo
    ->Belt.Array.map(memoIndexes =>
      indexes->Belt.Array.map(index => Belt.Array.concat(memoIndexes, [index]))
    )
    ->Belt.Array.concatMany
  })

  permutations
  ->Belt.Array.map(indices => (getColocationScore(indices), indices))
  ->Belt.Array.get(0)
  ->Belt.Option.getExn
}

let getResultMetadata = (~queryTerms, ~matchedTerms, ~fullTextSearchHistoryItem) => {
  let (colocationScore, termSegmentIndices) = getColocationScore(
    ~matchedTerms,
    ~fullTextSearchHistoryItem,
  )
  let matchScore = getMatchScore(~matchedTerms, ~queryTerms)
  let contextScore = getContextScore(~matchedTerms, ~termSegmentIndices, ~fullTextSearchHistoryItem)
  let scores = [(matchScore, 1.0), (colocationScore, 3.0), (contextScore, 2.0)]
  let totalWeight = scores->Belt.Array.reduce(0.0, (sum, (_, weight)) => sum +. weight)

  {
    score: Belt.Array.reduce(scores, 0.0, (sum, (score, weight)) =>
      sum +. score *. (weight /. totalWeight)
    ),
    termSegmentIndices: termSegmentIndices,
  }
}
