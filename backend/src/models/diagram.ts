import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const diagramSchema = new Schema({
  id: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  nodes: {
    type: Object,
  },
  connectors: {
    type: Object,
  },
  updatedAt: {
    type: String,
  },
  createdAt: {
    type: String,
  },
});

export default model("Diagram", diagramSchema);
