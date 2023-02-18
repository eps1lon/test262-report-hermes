export default function RootLayout({ children }) {
  return (
    <html>
      <head />
      <body>
        <header>Hermes test262 report </header>
        <main>
          <section>
            <h1>test262</h1>
            {children}
          </section>
        </main>
        <footer></footer>
      </body>
    </html>
  );
}
