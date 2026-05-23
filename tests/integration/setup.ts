import { execSync } from 'child_process'
import { testPrisma } from './prisma'

export async function setup() {
  execSync('npx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL_TEST },
    stdio: 'inherit',
  })
}

export async function teardown() {
  await testPrisma.$disconnect()
}

export async function cleanDb() {
  await testPrisma.transaction.deleteMany()
  await testPrisma.property.deleteMany()
  await testPrisma.user.deleteMany()
}
