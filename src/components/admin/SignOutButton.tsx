"use client";

import { LogOutIcon } from "@payloadcms/ui";

// Replaces Payload's logout link: the session is a Supabase one, so it is cleared by the app's sign-out
// route (POST only), which also ends the session on the public site.
export function SignOutButton() {
  return (
    <form method="post" action="/auth/signout" style={{ display: "contents" }}>
      <button
        type="submit"
        aria-label="Log out"
        title="Log out"
        className="nav__log-out"
        style={{ background: "none", border: 0, padding: 0, cursor: "pointer" }}
      >
        <LogOutIcon />
      </button>
    </form>
  );
}
