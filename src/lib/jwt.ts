import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "bharatos-super-secret-key-12345";

export interface JWTPayload {
  userId: string;
  name: string;
  email: string;
  role: string;
  exp?: number;
}

// Generate a simple HS256 JWT using crypto
export function signToken(payload: JWTPayload): string {
  const header = { alg: "HS256", typ: "JWT" };
  const base64Header = Buffer.from(JSON.stringify(header)).toString("base64url");
  
  // Set expiration (e.g., 24 hours)
  const exp = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
  const fullPayload = { ...payload, exp };
  const base64Payload = Buffer.from(JSON.stringify(fullPayload)).toString("base64url");

  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${base64Header}.${base64Payload}`)
    .digest("base64url");

  return `${base64Header}.${base64Payload}.${signature}`;
}

// Verify a simple HS256 JWT
export function verifyToken(token: string): JWTPayload | null {
  try {
    const [headerB64, payloadB64, signature] = token.split(".");
    if (!headerB64 || !payloadB64 || !signature) return null;

    const expectedSignature = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${headerB64}.${payloadB64}`)
      .digest("base64url");

    if (signature !== expectedSignature) return null;

    const payloadStr = Buffer.from(payloadB64, "base64url").toString("utf8");
    const payload = JSON.parse(payloadStr) as JWTPayload;

    // Check expiration
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      return null;
    }

    return payload;
  } catch (err) {
    return null;
  }
}
