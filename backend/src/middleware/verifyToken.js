import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  let token = null;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || (!decoded.id && !decoded.userId)) {
      return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });
    }

    // Handle both possible token formats
    req.userId = decoded.userId || decoded.id;
    next();
  } catch (error) {
    console.log("Token verification error:", error.message);
    
    // Clear invalid cookies
    res.clearCookie('token');
    
    return res.status(401).json({ 
      success: false, 
      message: "Invalid or expired token", 
      clearToken: true 
    });
  }
};
