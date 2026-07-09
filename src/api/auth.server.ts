import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";
import { jwtVerify, SignJWT } from "jose";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret_medicart_123");
const COOKIE_NAME = "medicart_session";

export async function getUserSession() {
  const token = getCookie(COOKIE_NAME);
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return { id: payload.sub as string, role: payload.role as string };
  } catch {
    return null;
  }
}

export async function handleGetSession() {
  const token = getCookie(COOKIE_NAME);
  if (!token) return { status: "success", data: null };

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const user = await db.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      deleteCookie(COOKIE_NAME);
      return { status: "success", data: null };
    }
    
    const { passwordHash, ...safeUser } = user;
    return { status: "success", data: safeUser };
  } catch (error) {
    deleteCookie(COOKIE_NAME);
    return { status: "success", data: null };
  }
}

export async function handleRegister(data: any) {
  try {
    const { name, email, password } = data;
    
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return { status: "error", message: "Email is already registered." };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    const count = await db.user.count();
    const role = count === 0 ? "ADMIN" : "USER";

    const user = await db.user.create({
      data: { name, email, passwordHash, role },
    });

    const token = await new SignJWT({ sub: user.id, role: user.role })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(JWT_SECRET);

    setCookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    const { passwordHash: _, ...safeUser } = user;
    return { status: "success", data: safeUser, message: "Registration successful" };
  } catch (error: any) {
    return { status: "error", message: error.message || "Registration failed" };
  }
}

export async function handleLogin(data: any) {
  try {
    const { email, password } = data;
    
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return { status: "error", message: "Invalid email or password." };
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return { status: "error", message: "Invalid email or password." };
    }

    const token = await new SignJWT({ sub: user.id, role: user.role })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(JWT_SECRET);

    setCookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    const { passwordHash: _, ...safeUser } = user;
    return { status: "success", data: safeUser, message: "Logged in successfully" };
  } catch (error: any) {
    return { status: "error", message: error.message || "Login failed" };
  }
}

export async function handleLogout() {
  deleteCookie(COOKIE_NAME, { path: "/" });
  return { status: "success", message: "Logged out successfully" };
}
