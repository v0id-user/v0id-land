import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  let prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

type CustomGlobal = typeof globalThis & {
  prisma?: ReturnType<typeof prismaClientSingleton>
}

const globalWithPrisma = globalThis as CustomGlobal
const prisma = globalWithPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalWithPrisma.prisma = prisma
}

export default prisma