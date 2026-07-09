import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getSessionFn = createServerFn({ method: "GET" })
  .handler(async () => {
    const { handleGetSession } = await import("./auth.server");
    return handleGetSession();
  });

const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerFn = createServerFn({ method: "POST" })
  .validator(RegisterSchema)
  .handler(async ({ data }) => {
    const { handleRegister } = await import("./auth.server");
    return handleRegister(data);
  });

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const loginFn = createServerFn({ method: "POST" })
  .validator(LoginSchema)
  .handler(async ({ data }) => {
    const { handleLogin } = await import("./auth.server");
    return handleLogin(data);
  });

export const logoutFn = createServerFn({ method: "POST" })
  .handler(async () => {
    const { handleLogout } = await import("./auth.server");
    return handleLogout();
  });
