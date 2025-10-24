import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      phone?: string;
    } & DefaultSession['user'];
  }

  interface User {
    firstName: string;
    lastName: string;
    phone?: string;
  }
}
