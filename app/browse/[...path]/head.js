export default function Head({ params }) {
  // title needs a single string as children
  const title = `/${params.path.join("/")} Hermes test262 report`;
  return (
    <>
      <title>{title}</title>
    </>
  );
}
