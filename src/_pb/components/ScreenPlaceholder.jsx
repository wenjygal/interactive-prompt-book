export default function ScreenPlaceholder({ title, note }) {
  return (
    <section>
      <h1 style={{ fontSize: "var(--fs-h2)", marginBottom: "var(--space-2)" }}>{title}</h1>
      <p style={{ color: "var(--color-text-secondary)" }}>{note || "המסך הזה ייבנה בשלב הבא."}</p>
    </section>
  );
}
