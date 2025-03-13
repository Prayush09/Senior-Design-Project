'use client';

import { signIn } from 'next-auth/react';

export default function SignIn() {
  return (
    <div>
      {/* Credentials sign-in */}
      <button onClick={() => signIn('credentials')}>Sign in with Credentials</button>

      {/* Google sign-in */}
      <button onClick={() => signIn('google')}>Sign in with Google</button>
    </div>
  );
}
