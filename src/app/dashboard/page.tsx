import { redirect } from "next/navigation";

// Safety net only: the Google OAuth callback (per its documented contract)
// redirects the browser to {FRONTEND_URL}/dashboard on success, but this
// app's home page is "/" — there is no real /dashboard route. If the
// backend really does send users here, land them somewhere real instead of
// a 404 rather than silently assuming the backend redirect target is wrong.
export default function DashboardRedirectPage() {
  redirect("/");
}
