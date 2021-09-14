let log = (tag, message) => {
  Js.log2(tag, message)
}

let error = e => {
  Js.log(Js.Exn.asJsExn(e))
}
