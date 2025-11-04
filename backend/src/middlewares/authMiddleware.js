const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log(authHeader)
  if (!authHeader) return res.status(401).send("Token requerido");

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send("Token inválido o expirado");
    req.user = user; // datos del token
    next();
  });
};

export default authMiddleware