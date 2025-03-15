import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from '@resunet/db/src';


const JWT_SECRET = process.env.NEXTAUTH_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

//Register User
export const registerUser = async (name: string, email: string, password: string, image?: string) => {
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new Error('User already exists');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  let user;

  if(image){
    user = await prisma.user.create({
        data: {
            name,
            email,
            password: passwordHash,
            image: image
        }
    })
  }
  else{
    user = await prisma.user.create({
        data: {
          name,
          email,
          password: passwordHash
        }
      });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: '1d'
  });

  return { user, token };
};

//Login User
export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error('User not found');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: '1d'
  });

  return { user, token };
};

// Verify Google Token
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (Token: string) => {
  const ticket = await client.verifyIdToken({
    idToken: Token,
    audience: process.env.GOOGLE_CLIENT_ID
  });

  const payload = ticket.getPayload();

  if (!payload) throw new Error('Invalid Google token');

  const { email, name } = payload;

  let user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: email!,
        name: name!,
        password: 'google-auth'
      }
    });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: '1d'
  });

  return { user, token };
};

//  Logout User
export const logoutUser = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error('User not found');
  }

  // No real logout needed for JWT,TODO: just delete token on client side
  return { message: 'Logged out successfully' };
};
