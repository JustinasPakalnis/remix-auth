import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();
const NUM_USERS = 100000;
const BATCH_SIZE = 1000; // You can adjust the batch size based on your DB's capacity
const CONCURRENT_BATCHES = 5; // Number of concurrent insert batches

async function createUsers() {
  const users: { email: string; password: string; admin: boolean }[] = [];
  const emailSet = new Set<string>();

  for (let i = 0; i < NUM_USERS; i++) {
    let email: string;

    // Generate a unique email
    do {
      email = faker.internet.email();
    } while (emailSet.has(email));

    emailSet.add(email);

    const password = await bcrypt.hash("password", 10);
    const admin = Math.random() < 0.1; // 10% admin users

    users.push({
      email,
      password,
      admin,
    });

    // When we have reached the batch size, start parallelizing the insertions
    if (users.length >= BATCH_SIZE) {
      // Batch the users and insert them in parallel
      await insertUsersInParallel(users);
      users.length = 0; // Reset the batch
    }
  }

  // Insert any remaining users in parallel
  if (users.length > 0) {
    await insertUsersInParallel(users);
  }
}

// Function to insert users in parallel
async function insertUsersInParallel(
  users: { email: string; password: string; admin: boolean }[]
) {
  const chunks = chunkArray(users, CONCURRENT_BATCHES); // Divide the array into smaller chunks
  const promises = chunks.map(async (chunk) => {
    return prisma.user.createMany({ data: chunk });
  });

  // Wait for all promises to complete
  await Promise.all(promises);
}

// Utility function to chunk an array into smaller arrays
function chunkArray(array: any[], chunkSize: number) {
  const chunks: any[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

async function main() {
  try {
    console.log(`Seeding ${NUM_USERS} users...`);
    await createUsers();
    console.log("Seeding completed!");
  } catch (error) {
    console.error("Error seeding users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
