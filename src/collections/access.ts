import type { Access } from "payload";

// Visitors can read published documents only; signed-in back-office users can read drafts too.
// Writes require a signed-in user (Payload default). Permission checks replace this in P1.4.
export const publishedOrSignedIn: Access = ({ req }) => {
  if (req.user) return true;
  return { _status: { equals: "published" } };
};
