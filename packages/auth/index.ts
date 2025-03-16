import NextAuth from 'next-auth';

import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';


export const handler = NextAuth({
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!
      }),
      CredentialsProvider({
        name: 'credentials',
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Missing credentials');
          }
  
          const res = await fetch(`${process.env.BACKEND_URL}/api/pages/auth/signin`, {
            method: 'POST',
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            }),
            headers: { 'Content-Type': 'application/json' }
          });
  
          const user = await res.json();
  
          if (res.ok && user) {
            return user;
          } else {
            throw new Error(user?.message || res.statusText);
          }
        }
      })
    ],
    pages: {
      signIn: '/auth/signin',
      error: '/auth/error',
      newUser: '/welcome',
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
      strategy: 'jwt',
    },
    jwt: {
      secret: process.env.NEXTAUTH_SECRET
    },
    callbacks: {
        async jwt({ token, user, account }) {
            if (account?.provider === 'google' && user) {
              token.accessToken = account.access_token;
              token.id = user.id;
            }
          
            if (user) {
              token.id = user.id;
              token.accessToken = (user as any).token || token.accessToken;
            }
          
            return token;
          },
      //TODO: Fix the issue of recognizing user Id and accessToken for session.
      async session({ session, token }) {
        if (token) {
          if (session.user) {
            session.user.id = token.id;
          }
          session.accessToken = token.accessToken;
        }
        return session;
      }
    }
  });
  

  