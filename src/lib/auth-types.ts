import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string | null;
      email: string;
      shopId: string | null;
      shopName: string | null;
      role: string;
    };
  }

  interface User {
    shopId?: string | null;
    shopName?: string | null;
    role?: string;
  }
}
