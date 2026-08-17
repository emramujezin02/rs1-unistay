export interface InviteResult {
  inviteId: string;
  email: string;
  expiresAt: string;
}

export interface InviteApiResult {
  inviteId?: string | number;
  InviteId?: string | number;
  email?: string;
  Email?: string;
  expiresAt?: string;
  ExpiresAt?: string;
  expiresAtUtc?: string;
  ExpiresAtUtc?: string;
}
