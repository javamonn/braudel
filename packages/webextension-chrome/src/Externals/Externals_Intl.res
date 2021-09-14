module Segmenter = {
  type t
  type granularity = [
    | #word
    | #grapheme
    | #sentence
  ]
  type params = {granularity: granularity}
  type segment = {
    segment: string,
    index: int,
    isWordLike: bool,
  }

  @scope("Intl") @new external make: (string, params) => t = "Segmenter"
  @send external segment: (t, string) => Js.Array.array_like<segment> = "segment"
}
