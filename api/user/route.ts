import { seedNewUser, findUser, getUserById } from "../../prisma/seed";

// Handle POST requests for signup
export async function handleSignup(req: any) {
  if (req.method !== "POST") {
    return { status: 405, error: "Method not allowed" };
  }

  try {
    const body = req.body || req.query;
    const { username, email, password } = body;

    // Validate input
    if (!username || !email || !password) {
      return { status: 400, error: "Missing required fields: username, email, password" };
    }

    // Call the seed function to create new user
    const result = await seedNewUser({
      name: username,
      email,
      password,
    });

    if (!result.success) {
      return { status: 400, error: result.error };
    }

    return {
      status: 201,
      message: "User created successfully",
      user: result.user,
    };
  } catch (error: any) {
    return { status: 500, error: error.message };
  }
}

// Handle POST requests for login
export async function handleLogin(req: any) {
  if (req.method !== "POST") {
    return { status: 405, error: "Method not allowed" };
  }

  try {
    const body = req.body || req.query;
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return { status: 400, error: "Missing required fields: email, password" };
    }

    // Find and verify user
    const result = await findUser({ email, password });

    if (!result.success) {
      return { status: 401, error: result.error };
    }

    return {
      status: 200,
      message: "Login successful",
      user: result.user,
    };
  } catch (error: any) {
    return { status: 500, error: error.message };
  }
}

// Handle GET requests to retrieve user
export async function handleGetUser(req: any) {
  if (req.method !== "GET") {
    return { status: 405, error: "Method not allowed" };
  }

  try {
    const userId = req.query?.id || req.params?.id;

    if (!userId) {
      return { status: 400, error: "User ID is required" };
    }

    const result = await getUserById(parseInt(userId));

    if (!result.success) {
      return { status: 404, error: result.error };
    }

    // Don't send password in response
    const { password, ...userWithoutPassword } = result.user;
    return {
      status: 200,
      user: userWithoutPassword,
    };
  } catch (error: any) {
    return { status: 500, error: error.message };
  }
}

// Main handler for all user routes
export async function handler(req: any) {
  const { method, url } = req;

  if (url.includes("signup")) {
    return handleSignup(req);
  } else if (url.includes("login")) {
    return handleLogin(req);
  } else if (method === "GET") {
    return handleGetUser(req);
  }

  return { status: 404, error: "Route not found" };
}

export default handler;
