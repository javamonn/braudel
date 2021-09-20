module NodeFilter = {
  @scope("NodeFilter") @val external filterAccept: int = "FILTER_ACCEPT"
  @scope("NodeFilter") @val external filterReject: int = "FILTER_REJECT"
  @scope("NodeFilter") @val external filterSkip: int = "FILTER_SKIP"
}
