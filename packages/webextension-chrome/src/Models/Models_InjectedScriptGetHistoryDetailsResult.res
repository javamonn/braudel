type t = {textContent: string, title: string, faviconUrl: string}

let make = (~textContent, ~title, ~faviconUrl) => {
  textContent: textContent,
  title: title,
  faviconUrl: faviconUrl,
}
