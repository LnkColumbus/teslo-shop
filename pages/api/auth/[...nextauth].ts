import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import Credentials from 'next-auth/providers/credentials'

import { dbUsers } from '../../../database';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Credentials({
      name: 'Custom Login',
      credentials: {
        email: { label: 'Correo:', type: 'email', placeholder: 'example@google.com' },
        password: { label: 'Contraseña:', type: 'password', placeholder: 'contraseña' }
      },
      async authorize(credentials) {
        console.log({credentials});
        //TODO: validar contra base de datos
        
        return await dbUsers.checkUserEmailPassword(credentials!.email, credentials!.password);
      }
    }),
    // ...add more providers here
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
  ],
  // Custom pages
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },
  // Session
  session: {
    maxAge: 2592000,
    strategy: 'jwt',
    updateAge: 86400
  },
  // Callbacks
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        switch (account.type) {
          case 'oauth':
            token.user = await dbUsers.oAuthToDbUser(user?.email || '', user?.name || '');
            break;

          case 'credentials':
            token.user = user;
            break;
        }
      }

      return token;
    },
    async session({ session, token, user }) {
      // console.log({ session, token, user });
      session.accessToken = token.accessToken;
      session.user = token.user as any; 

      return session;
    }
  }
})