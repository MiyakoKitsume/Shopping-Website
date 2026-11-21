import { promisify } from "util";
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "crypto";
import type { Request, Response } from "express";
import { loadStore, saveStore, type SessionRecord, type UserRecord } from "./store.ts";

const scrypt = promisify(scryptCallback);
const SESSION_MS = 1000 * 60 * 60 * 24 * 7;
const COOKIE = "stride_session";

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, 32)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const derived = (await scrypt(password, salt, 32)) as Buffer;
  const storedBuf = Buffer.from(hash, "hex");
  if (storedBuf.length !== derived.length) return false;
  return timingSafeEqual(storedBuf, derived);
}

export function parseCookies(header?: string) {
  const cookies: Record<string, string> = {};
  if (!header) return cookies;
  for (const part of header.split(";")) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    try {
      cookies[key] = decodeURIComponent(value);
    } catch {
      cookies[key] = value;
    }
  }
  return cookies;
}

function pruneSessions(sessions: SessionRecord[]) {
  const now = Date.now();
  return sessions.filter((session) => session.expiresAt > now);
}

export function createSession(userId: string) {
  const store = loadStore();
  const token = randomBytes(24).toString("hex");
  store.sessions = pruneSessions(store.sessions);
  store.sessions.push({
    token,
    userId,
    expiresAt: Date.now() + SESSION_MS,
  });
  saveStore(store);
  return token;
}

export function setSessionCookie(res: Response, token: string) {
  const parts = [
    `${COOKIE}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${Math.floor(SESSION_MS / 1000)}`,
  ];
  if (process.env.NODE_ENV === "production") parts.push("Secure");
  res.setHeader("Set-Cookie", parts.join("; "));
}

export function clearSessionCookie(res: Response) {
  res.setHeader(
    "Set-Cookie",
    `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
  );
}

export function destroySession(token?: string) {
  if (!token) return;
  const store = loadStore();
  store.sessions = pruneSessions(store.sessions).filter((session) => session.token !== token);
  saveStore(store);
}

export function getSessionUser(req: Request): UserRecord | null {
  const token = parseCookies(req.headers.cookie)[COOKIE];
  if (!token) return null;
  const store = loadStore();
  store.sessions = pruneSessions(store.sessions);
  const session = store.sessions.find((item) => item.token === token);
  if (!session) return null;
  return store.users.find((user) => user.id === session.userId) ?? null;
}

export function sessionToken(req: Request) {
  return parseCookies(req.headers.cookie)[COOKIE];
}
