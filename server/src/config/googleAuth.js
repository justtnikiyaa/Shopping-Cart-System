import { OAuth2Client } from "google-auth-library";
import env from "./env.js";

const isGoogleAuthConfigured = Boolean(env.googleClientId && env.googleClientSecret);

const googleClient = new OAuth2Client(env.googleClientId || undefined);

const verifyGoogleIdToken = async (idToken) => {
  if (!isGoogleAuthConfigured) {
    throw new Error("Google OAuth is not configured on the server");
  }

  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: env.googleClientId
  });

  return ticket.getPayload();
};

export { googleClient, isGoogleAuthConfigured, verifyGoogleIdToken };
