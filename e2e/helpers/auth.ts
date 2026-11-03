import { SignJWT } from "jose";
import type { BrowserContext } from "@playwright/test";

export async function addCanvasTestSession(
  context: BrowserContext,
  baseURL: string,
  userId = 0,
) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is required. Set it in the local .env file.");
  }

  const token = await new SignJWT({
    id: userId,
    fullName: "Playwright Canvas Test",
    email: "playwright-canvas@example.invalid",
    role: "user",
    status: "active",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(new TextEncoder().encode(secret));

  await context.addCookies([
    {
      name: "auth_token",
      value: token,
      url: baseURL,
      httpOnly: true,
      sameSite: "Lax",
    },
  ]);
}
