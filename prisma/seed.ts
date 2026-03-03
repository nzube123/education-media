import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const adapter = new PrismaPg({connectionString: process.env.DATABASE_URL})
const prisma = new PrismaClient({adapter})

// Function to seed a new user during signup
export async function seedNewUser({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return { success: true, user: { id: newUser.id, name: newUser.name, email: newUser.email } };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Function to find user by email and verify password
export async function findUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { success: false, error: "Invalid password" };
    }

    return {
      success: true,
      user: { id: user.id, name: user.name, email: user.email },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Function to get user by ID
export async function getUserById(id: number) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        posts: true,
        comments: true,
        messages: true,
      },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    return { success: true, user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Seed initial data
async function main() {
  try {
    const Confidence = await prisma.user.upsert({
      where: { email: "ndu4chicon@gmail.com" },
      update: {},
      create: {
        name: "Confidence Ndubuisi",
        email: "ndu4chicon@gmail.com",
        password: await bcrypt.hash("default123", 10),
      },
    });
    const Theophilus = await prisma.user.upsert({
      where: { email: "theophilussolomon@gmail.com" },
      update: {},
      create: {
        name: "Thephilus Solomon",
        email: "theophilussolomon@gmail.com",
        password: await bcrypt.hash("default123", 10),
      },
    });
    const createPost = await prisma.post.upsert({
      where: { id: 1 },
      update: {},
      create: {
        title: "First Post",
        content: "This is my first Post of the Year on this site thanks for listening and reading",
        authorId: Confidence.id,
      },
    });
    console.log("Seeding completed successfully");
  } catch (error) {
    console.error("Seeding error:", error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });