import { Request, Response } from "express";
import Usuario from "../models/usuarioModel";
import { encrypt } from "../utils/bcrypt.utils";

export const registrarUsuario = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    console.log(req.body);

    // Encriptar la contraseña
    const contraseñaEncriptada = await encrypt(password);

    console.log(req.body);
    console.log(contraseñaEncriptada);
    const usuario = new Usuario({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: contraseñaEncriptada,
    });
    await usuario.save();

    res.status(201).json(usuario);
  } catch (error:any) {
    if (error.name === "ValidationError") {
      res.status(400).json({
        mensaje: "Error de validación al guardar la persona o el usuario",
        error,
      });
    } else {
      res.status(500).json({
        mensaje: "Error interno del servidor al registrar el usuario",
        error,
      });
    }
  }
};

export const obtenerUsuarios = async (req: Request, res: Response) => {
  try {
    const usuarios = await Usuario.find();
    res.status(200).json(usuarios);
  } catch (error) {
    res
      .status(400)
      .json({ mensaje: "Hubo un error al obtener los usuarios", error });
  }
};

export const obtenerUsuario = async (req: Request, res: Response) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.status(200).json(usuario);
  } catch (error) {
    res
      .status(400)
      .json({ mensaje: "Hubo un error al obtener el usuario", error });
  }
};

export const actualizarUsuario = async (req: Request, res: Response) => {
  try {
    const { nombre, email, contraseña } = req.body;

    // Buscamos el usuario a actualizar en la base de datos
    const usuarioActualizado = await Usuario.findById(req.params.id);
    if (!usuarioActualizado) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const usuarioGuardado = await usuarioActualizado.save();

    res.status(200).json(usuarioGuardado);
  } catch (error) {
    res
      .status(400)
      .json({ mensaje: "Hubo un error al actualizar el usuario", error });
  }
};

export default {
  registrarUsuario,
  obtenerUsuarios,
  obtenerUsuario,
  actualizarUsuario,
};
