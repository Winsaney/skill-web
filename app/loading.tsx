export default function Loading() {
  return (
    <main aria-label="页面加载中">
      <div className="loading-grid">
        <div className="skeleton" />
        <div className="skeleton" />
        <div className="skeleton" />
      </div>
    </main>
  );
}
