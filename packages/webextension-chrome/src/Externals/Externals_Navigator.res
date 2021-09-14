module Storage = {
  @scope(("navigator", "storage")) @val external persist: unit => Js.Promise.t<bool> = "persist"
}

@scope("navigator") @val external language: string = "language"
