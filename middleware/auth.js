import crypto from 'crypto';
import supabase, { localDb } from '../db.js';

const SECRET_KEY = process.env.SESSION_SECRET || process.env.JWT_SECRET || 'passgate-secure-auth-secret-2026';

/**
 * Generate a cryptographically signed session token for a staff user
 * @param {object} payload - Data to embed in the token (e.g. { id, username, role })
 * @returns {string} Signed token in format "base64Payload.base64Signature"
 */
export function generateToken(payload) {
  // Set 24-hour expiration by default
  const tokenPayload = {
    ...payload,
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000
  };

  const encodedData = Buffer.from(JSON.stringify(tokenPayload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(encodedData)
    .digest('base64url');

  return `${encodedData}.${signature}`;
}

/**
 * Verify and parse a signed session token
 * @param {string} token
 * @returns {object|null} Decoded payload or null if invalid/expired
 */
export function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [encodedData, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(encodedData)
    .digest('base64url');

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedData, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Express Middleware: Ensures the request is from an authenticated staff member
 * Checks both "Authorization: Bearer <token>" header and "passgate_token" cookie
 */
export async function requireStaff(req, res, next) {
  let token = null;

  // 1. Check Authorization Header (Bearer token)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  }

  // 2. Fallback to HTTP Cookie
  if (!token && req.headers.cookie) {
    const cookieMatch = req.headers.cookie.match(/(?:^|;\s*)passgate_token=([^;]+)/);
    if (cookieMatch) {
      token = decodeURIComponent(cookieMatch[1]);
    }
  }

  // 3. Fallback to Query Parameter (?token=...) for direct browser download links
  if (!token && req.query && req.query.token) {
    token = String(req.query.token).trim();
  }

  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized: Staff authentication required.',
      code: 'AUTH_REQUIRED'
    });
  }

  // 4. Verify Token
  const payload = verifyToken(token);
  if (!payload || !payload.id) {
    return res.status(401).json({
      error: 'Unauthorized: Invalid or expired staff session token.',
      code: 'INVALID_TOKEN'
    });
  }

  // 5. Confirm Staff User Exists (Supabase with local fallback)
  try {
    let staff = null;
    try {
      const { data } = await supabase
        .from('staff')
        .select('id, username, role')
        .eq('id', payload.id)
        .single();
      if (data) staff = data;
    } catch {}

    if (!staff) {
      staff = localDb.prepare('SELECT id, username, role FROM staff WHERE id = ?').get(payload.id);
    }

    if (!staff) {
      return res.status(401).json({
        error: 'Unauthorized: Staff member no longer exists.',
        code: 'USER_NOT_FOUND'
      });
    }

    req.staff = staff;
    next();
  } catch (err) {
    console.error('Error verifying staff in database:', err);
    return res.status(500).json({ error: 'Internal server authentication error.' });
  }
}
