export function formatDate(timestamp) {
  const d = new Date(timestamp);
  const opts = { month: "short", day: "numeric" };
  if (d.getFullYear() !== new Date().getFullYear()) opts.year = "numeric";
  return d.toLocaleDateString(undefined, opts);
}

export function formatReminder(timestamp) {
  if (!timestamp) return "";
  const d = new Date(timestamp);
  const now = new Date();
  const opts = { month: "short", day: "numeric" };
  if (d.getFullYear() !== now.getFullYear()) opts.year = "numeric";
  const datePart = d.toLocaleDateString(undefined, opts);
  const timePart = d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return `${datePart}, ${timePart}`;
}

export function isOverdue(timestamp) {
  return Boolean(timestamp) && timestamp < Date.now();
}

// Converts a ms timestamp into the string a <input type="datetime-local">
// expects (local time, no timezone suffix).
export function toDateTimeLocalValue(timestamp) {
  if (!timestamp) return "";
  const d = new Date(timestamp);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}`;
}