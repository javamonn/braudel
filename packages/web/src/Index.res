@react.component
let default = () => {
  <>
    <Externals.Next.Head>
      <title> {React.string("Braudel")} </title>
      <meta name="description" content="A co-pilot for your web browser." />
    </Externals.Next.Head>
    <main
      className={Cn.make([
        "max-w-5xl",
        "px-8",
        "font-mono",
        "py-8",
        "flex",
        "flex-col",
        "justify-between",
        "content-between",
        "flex-1",
        "overflow-y-auto",
      ])}>
      <section>
        <p className={Cn.make(["mb-6", "text-lg"])}>
          {React.string(
            "Web browsers are designed for content consumption. The web is vast, impersonal, and ephemeral. We spend hours every day searching and browsing, creating new tabs and orphaning others.",
          )}
        </p>
        <p className={Cn.make(["mb-6", "text-lg"])}>
          {React.string("What if your web browser went beyond simply helping you to ")}
          <i> {React.string("consume")} </i>
          {React.string(" information, to helping you to ")}
          <i> {React.string("contextualize")} </i>
          {React.string(", ")}
          <i> {React.string("understand")} </i>
          {React.string(", and ")}
          <i> {React.string("retain")} </i>
          {React.string(" that information?")}
        </p>
        <p className={Cn.make(["mb-6", "text-lg"])}>
          <b> <u> {React.string("Braudel")} </u> </b>
          {React.string(
            " is a co-pilot and librarian for you web browser that augments information with your historical context and manages your personal knowledge-base of sources.",
          )}
        </p>
        <ul className={Cn.make(["text-lg", "list-disc", "list-inside"])}>
          <li>
            {React.string(
              "View where, how, and when you previously encountered a term, person, or page.",
            )}
          </li>
          <li>
            {React.string("Full text search the contents of you browsing history and metadata.")}
          </li>
          <li> {React.string("Organize and manage bookmarks and sources.")} </li>
        </ul>
      </section>
      <section className={Cn.make(["mt-32"])}>
        <p className={Cn.make(["text-lg", "mb-2"])}>
          <b> <u> {React.string("Braudel")} </u> </b> {React.string(" is a work in progress.")}
        </p>
        <p className={Cn.make(["text-lg", "mb-2"])}>
          {React.string("> ")}
          <a href="https://forms.gle/BFusPJYnJDVgb8hm8" className={Cn.make(["underline"])}>
            {React.string("Share your email")}
          </a>
          {React.string(" to get access to the alpha once it's ready.")}
        </p>
        <p className={Cn.make(["text-lg"])}>
          {React.string("> ")}
          <a href="https://twitter.com/javamonnn" className={Cn.make(["underline"])}>
            {React.string("Share your thoughts")}
          </a>
          {React.string(" on Twitter to help guide development.")}
        </p>
      </section>
    </main>
  </>
}
