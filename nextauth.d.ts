import NextAuth, { DefaultSession } from "next-auth"

// nextauth.d.ts
declare module "next-auth" {
    interface User {
      role?: Role;    
      id?:string
    }
  
interface Session extends DefaultSession {
      user?: User;
      image?:string
    }
  }