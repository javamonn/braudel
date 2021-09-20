@react.component
let default = () => {
  <>
    <Externals.Next.Head> <title> {React.string("Braudel")} </title> </Externals.Next.Head>
    <main
      className={Cn.make([
        "max-w-5xl",
        "mx-8",
        "font-mono",
        "my-16",
        "flex",
        "flex-col",
        "justify-between",
        "content-between",
        "flex-1",
      ])}>
      <section>
        <p className={Cn.make(["mb-6", "text-xl"])}>
          {React.string(
            "Web browsers are designed for content consumption. The web is vast, impersonal, and ephemeral. We spend hours every day searching and browsing, creating new tabs and orphaning others.",
          )}
        </p>
        <p className={Cn.make(["mb-6", "text-xl"])}>
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
        <p className={Cn.make(["mb-6", "text-xl"])}>
          <b> <u> {React.string("Braudel")} </u> </b>
          {React.string(
            " is a co-pilot and librarian for you web browser that augments information with your historical context and manages your personal knowledge-base of sources.",
          )}
        </p>
        <ul className={Cn.make(["text-xl", "list-disc", "list-inside"])}>
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
      <section>
        <p className={Cn.make(["text-xl", "mb-2"])}>
          {React.string("Braudel is a work in progress. ")}
          <a href="https://forms.gle/BFusPJYnJDVgb8hm8" className={Cn.make(["underline"])}>
            {React.string("Share your email")}
          </a>
          {React.string(" to get access to the alpha once it's ready.")}
        </p>
      </section>
    </main>
  </>
}
