import { Request, Response } from "express";
import { io } from "../index";
import Diagram from "../models/diagram";

export const getDiagrams = async (req: Request, res: Response) => {
  try {
    const diagrams = await Diagram.find();

    res.status(200).json(diagrams);
  } catch (err: any) { // Especificar el tipo 'Error'
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const getDiagram = async (req: Request, res: Response) => {
  try {
    const diagram = await Diagram.findById(req.params.id);
    console.log(diagram);

    res.status(200).json(diagram);
  } catch (err: any) { // Especificar el tipo 'Error'
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const createDiagram = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const diagram = await Diagram.create(req.body);

    res.status(201).json(diagram);
  } catch (err: any) { // Especificar el tipo 'Error'
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const updateDiagram = async (req: Request, res: Response) => {
  try {
    const { id, nodes, connectors } = req.body;
    console.log(req.body);
    const tables = Object.values(nodes);
    const relations = Object.values(connectors);

    const diagramUpdate = await Diagram.findByIdAndUpdate(id, {
      nodes: tables,
      connectors: relations,
    });

    io.emit("diagramUpdate", diagramUpdate);

    res.status(200).json(diagramUpdate);
  } catch (err: any) { // Especificar el tipo 'Error'
    console.log(err);
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const updateDiagramName = async (req: Request, res: Response) => {
  try {
    const { id, name } = req.body;

    const diagramUpdate = await Diagram.findByIdAndUpdate(id, {
      name: name,
    });

    res.status(200).json(diagramUpdate);
  } catch (err: any) { // Especificar el tipo 'Error'
    console.log(err);
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const deleteDiagram = async (req: Request, res: Response) => {
  try {
    console.log(req.params.id);
    await Diagram.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      message: "Diagram deleted successfully",
    });
  } catch (err: any) { // Especificar el tipo 'Error'
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

export default {
  getDiagrams,
  getDiagram,
  createDiagram,
  updateDiagram,
  updateDiagramName,
  deleteDiagram,
};
