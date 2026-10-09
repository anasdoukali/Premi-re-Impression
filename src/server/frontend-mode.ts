import "server-only";

/** Local previews use bundled content without opening a database connection. */
export const frontendOnly =
  process.env.FRONTEND_ONLY === "true" ||
  (process.env.NODE_ENV === "development" && !process.env.DATABASE_URL);
