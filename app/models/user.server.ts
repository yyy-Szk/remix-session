import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getUser(id: number) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByUsername(username: string) {
  return prisma.user.findUnique({ where: { username } });
}

export async function authenticateUser(username: string, password: string) {
  const user = await getUserByUsername(username);
  if (!user) {
    return false;
  }
  return user.password === password;
}

export async function createUser(username: string, password: string) {
  return prisma.user.create({
    data: { username, password }
  })
}
