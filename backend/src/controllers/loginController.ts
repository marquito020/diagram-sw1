import Usuario from "../models/usuarioModel";
import jsonwebtoken from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { verify } from "../utils/bcrypt.utils";

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ mensaje: "Debe proporcionar todos los campos requeridos" });
    }

    const userFound = await Usuario.findOne({ email });
    if (!userFound) {
      return res
        .status(400)
        .json({ mensaje: "El email no se encuentra registrado" });
    }

    const passwordMatch = await verify(password, userFound.password);
    if (!passwordMatch) {
      return res.status(400).json({ mensaje: "La contraseña es incorrecta" });
    }

    const token = jsonwebtoken.sign(
      { id: userFound._id },
      process.env.SECRET_KEY!,
      {
        expiresIn: 86400, // 24 horas
      }
    );

    res.status(200).json({
      token,
      _id: userFound._id,
      firstName: userFound.firstName,
      lastName: userFound.lastName,
      email: userFound.email,
    });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error interno del servidor al iniciar sesión", error });
  }
};

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(401).json({ mensaje: "No se ha proporcionado un token" });
  }

  /* jsonwebtoken.verify(token, process.env.SECRET_KEY!, (error, decoded) => {
    if (error) {
      return res.status(401).json({ mensaje: "Token inválido", error });
    }

    (req as any).userId = decoded.id;
    next();
  }); */
};

export default { login, verifyToken };
