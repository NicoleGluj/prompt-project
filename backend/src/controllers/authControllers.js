import jwt from "jsonwebtoken"
import User from "../models/UsersModel.js";
import bcrypt from "bcryptjs"
import dotenv from "dotenv";

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET

export const UserRegister = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).send("Email y password requeridos");

    const exists = await User.findOne({ email });

    if (exists) return res.status(400).send("Usuario ya registrado");

    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hash });
    await newUser.save();

    res.status(201).send("Usuario registrado correctamente");
  } catch (e) {
    console.log(e)
    res.status(500).send("Error en el registro");
  }
}

export const UserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(400).send("Credenciales inválidas");

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) return res.status(400).send("Credenciales inválidas");

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch {
    res.status(500).send("Error en el login");
  }
}

