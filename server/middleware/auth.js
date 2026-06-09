import jwt from "jsonwebtoken";

const SECRET_KEY = "inception_secret_key_demo"; // hardcoded for demo

export function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, caseId: user.caseId, name: user.name, avatar: user.avatar },
    SECRET_KEY,
    { expiresIn: "24h" }
  );
}

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, SECRET_KEY);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
