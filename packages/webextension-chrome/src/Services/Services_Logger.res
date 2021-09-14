exception PromiseError(Js.Promise.error)

let log = (tag, message) => {
  Js.log2(tag, message)
}

let error = (tag, message, e) => {
  Js.log3(tag, message, Js.Exn.asJsExn(e))
}
