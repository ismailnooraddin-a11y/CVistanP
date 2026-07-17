export default function Loading() {
  return (
    <main className="system-loading" aria-label="Loading workspace">
      <div className="system-loading__bar" />
      <div className="system-loading__metrics">
        {Array.from({ length: 4 }, (_, index) => <div key={index} className="system-loading__metric" />)}
      </div>
      <div className="system-loading__panel" />
    </main>
  );
}
