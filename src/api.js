// All calls to the FastAPI backend live here, so components never build URLs.
// Vite: set VITE_API_URL in .env. (Create React App uses REACT_APP_API_URL and process.env instead.)
const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      // FastAPI sends a string for our own errors, and a list of objects for validation (422) errors.
      if (typeof body.detail === "string") message = body.detail;
      else if (Array.isArray(body.detail)) message = body.detail.map((d) => d.msg).join(", ");
    } catch {
      /* response had no JSON body; keep the generic message */
    }
    throw new Error(message);
  }

  return res.status === 204 ? null : res.json(); // DELETE replies 204 with no body
}

export const getTickets = (params = {}) => {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ""),
  ).toString();
  return request(`/tickets${query ? `?${query}` : ""}`);
};

export const createTicket = (ticket) =>
  request("/tickets", { method: "POST", body: JSON.stringify(ticket) });

export const setResolved = (id, isResolved) =>
  request(`/tickets/${id}`, { method: "PATCH", body: JSON.stringify({ is_resolved: isResolved }) });

export const deleteTicket = (id) => request(`/tickets/${id}`, { method: "DELETE" });