import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET;

export async function verifyToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("pookieToken")?.value;

  if (!token) {
    throw new Error("No token, authorization denied");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err) {
    throw new Error("Token is not valid");
  }
}
