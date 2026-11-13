import { redirect } from "next/navigation";

const AUTH_PORTAL_URL = process.env.NEXT_PUBLIC_AUTH_PORTAL_URL ?? "http://localhost:3001";

export default function LoginPage() {
  redirect(`${AUTH_PORTAL_URL}/login`);
}
