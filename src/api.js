import { sampleDashboard } from "./data";

// Swap the body of this function for a real request, e.g.
//   const res = await fetch("/api/dashboard", { credentials: "include" });
//   if (!res.ok) throw new Error("Could not load dashboard");
//   return res.json();
// Keep the same response shape as sampleDashboard and the UI needs no changes.
export async function getDashboard() {
  await new Promise((r) => setTimeout(r, 400)); // fake latency for the loading state
  return sampleDashboard;
}
