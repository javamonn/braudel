exception PromiseError(Js.Promise.error)

let log = (tag, message) => {
  Js.log2(tag, message)
}

let logWithDetails = (tag, message, details) => {
  Js.log3(tag, message, details)
}

let error = (tag, message, e) => {
  Js.log3(tag, message, Js.Exn.asJsExn(e))
}
