type t = {
  historyItemId: string,
  createdAt: Js.Date.t,
  urlTermsIdx: array<int>,
  contentTermsIdx: array<int>,
  titleTermsIdx: array<int>,
  terms: array<string>,
}
