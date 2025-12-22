export class SessionResDto {
  id: string;
  userAgent: string | null;
  ip: string | null;
  createdAt: Date;
  expiresDate: Date;
  isCurrent: boolean;
}
