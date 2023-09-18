import { createCookieSessionStorage } from "@remix-run/node";

type SessionData = {
  userId: string;
};

type SessionFlashData = {
  message: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>(
    {
      cookie: {
        name: "__session",
        httpOnly: true,
        maxAge: 3600,
        path: "/",
        sameSite: "lax",
        secrets: ["s3cret1"],
        secure: process.env.NODE_ENV === "production" ? true : false
      },
    }
  );

export { getSession, commitSession, destroySession };
