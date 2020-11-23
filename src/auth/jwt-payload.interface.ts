export interface JwtPayload {
  username: string;
  fullname: string;
  isAdmin?: boolean;
}
