export interface User {
  id?: number;
  name: string;
  email: string;
  role: "ADMIN" | "DEFAULT_USER";
  phone?: string;
  createdAt?: string;
  ticketIds?: number[];
}
