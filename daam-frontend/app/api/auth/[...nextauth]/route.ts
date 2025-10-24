import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authenticateUser, debugUsers } from '@/lib/users';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('🚀 NextAuth authorize called');
        console.log('📥 Received credentials:', credentials);
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing credentials');
          return null;
        }

        // Debug: show all users
        debugUsers();

        try {
          const user = await authenticateUser(
            credentials.email as string,
            credentials.password as string
          );

          if (user) {
            console.log('✅ NextAuth: Authentication successful');
            return {
              id: user.id,
              email: user.email,
              name: `${user.firstName} ${user.lastName}`,
              firstName: user.firstName,
              lastName: user.lastName,
              phone: user.phone,
            };
          } else {
            console.log('❌ NextAuth: Authentication failed');
            return null;
          }
        } catch (error) {
          console.error('💥 NextAuth authorize error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log('🎟️  JWT callback - user:', user);
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.phone = user.phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        console.log('🔗 Session callback - token:', token);
        session.user.id = token.id as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.phone = token.phone as string;
      }
      return session;
    },
  },
  debug: true, 
});

export { handler as GET, handler as POST };
