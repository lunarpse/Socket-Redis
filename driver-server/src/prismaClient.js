
const {PrismaClient}=require('@prisma/client')
// Ensure Prisma finds the generated client
const prisma = new PrismaClient({
  datasources: {
    db: {
      url:process.env.DATABASE_URL
    }
  }
});
module.exports=prisma;