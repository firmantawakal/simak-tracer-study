import crypto from 'crypto';

export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex'); // 64 chars
}

export function hashToken(token: string): string {
  return crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
}

export function generateTokenWithExpiry(days: number = 7) {
  const token = generateSecureToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);

  return {
    token,
    tokenHash: hashToken(token),
    expiresAt,
  };
}