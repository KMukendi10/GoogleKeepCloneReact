export default function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className="toast" role="status" aria-live="polite">
      <span>{toast.message}</span>
      {toast.actionLabel && (
        <button className="toast__action" onClick={toast.onAction}>
          {toast.actionLabel}
        </button>
      )}
    </div>
  );
}
