export default function ContextPackagePanel({ context }) {
  return (
    <section className="panel">
      <h2>Grounded Context Package</h2>
      <pre className="code-block">{JSON.stringify(context, null, 2)}</pre>
    </section>
  );
}