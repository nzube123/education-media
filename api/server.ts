import express, { Request, Response } from "express";
import path from "path";
import { seedNewUser, findUser, getUserById } from "../prisma/seed";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../html")));
app.use(express.static(path.join(__dirname, "../css")));
app.use(express.static(path.join(__dirname, "../js")));

// Root route - serve index.html
app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../html/index.html"));
});

// Signup route - handles form submission from signup.html
app.post("/signup", async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: username, email, password",
      });
    }

    // Seed the database with the new user
    const result = await seedNewUser({
      name: username,
      email,
      password,
    });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
      });
    }

    // Redirect to login or success page after successful signup
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: result.user,
      redirect: "/index.html", // Redirect to login page
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred during signup",
    });
  }
});

// Login route
app.post("/api/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: email, password",
      });
    }

    const result = await findUser({ email, password });

    if (!result.success) {
      return res.status(401).json({
        success: false,
        error: result.error,
      });
    }

    // In production, you'd set a session/JWT token here
    res.json({
      success: true,
      message: "Login successful",
      user: result.user,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred during login",
    });
  }
});

// Get user by ID route
app.get("/api/user/:id", async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);

    if (!userId || isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: "Valid user ID is required",
      });
    }

    const result = await getUserById(userId);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        error: result.error,
      });
    }

    // Don't send password in response
    const { password, ...userWithoutPassword } = result.user;
    res.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error: any) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred retrieving user",
    });
  }
});

// Serve static routes
app.get("/explore", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../html/explore.html"));
});

app.get("/messages", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../html/messages.html"));
});

app.get("/profile", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../html/profile.html"));
});

app.get("/settings", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../html/settings.html"));
});

app.get("/notifications", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../html/notifications.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
