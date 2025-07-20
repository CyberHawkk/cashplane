export const register = async (req, res) => {
  try {
    console.log("Register route hit", req.body);
    // ... your Supabase registration logic
  } catch (error) {
    console.error("Registration failed:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
