
// import jwt from "jsonwebtoken"
// import User from "../model/userModel.js";

// export const authenticate = async (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader?.startsWith('Bearer ')) {
//     return res.status(401).json({ error: 'Missing token' });
//   }

//     console.log('✅ Connected user:', user.username); // ✅ Add here

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findByPk(decoded.id);
//     if (!user) throw new Error();

//     req.user = user;
//     next();
//   } catch {
//     return res.status(401).json({ error: 'Invalid or expired token' });
//   }
// };









import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) throw new Error();

    console.log('✅ Authenticated user in REST:', user.username); // ✅ Correct spot

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
