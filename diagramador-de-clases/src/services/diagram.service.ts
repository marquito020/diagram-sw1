import { baseUrl } from "../constants/routes";

export const diagramUrl = baseUrl + "/api/diagram";

import {

    Segments,
    RelationShipModel,
} from '@syncfusion/ej2-react-diagrams';

type CustomNode = {
    id: string;
    offsetX: number;
    offsetY: number;
    className: string;
    attributes: Attribute[];
};

type Attribute = {
    name: string;
    type: 'string' | 'boolean' | 'number';
};

type CustomConnector = {
    id: string;
    sourceID: string;
    targetID: string;
    type: Segments,
    shape: RelationShipModel;
};

const getDiagrams = async () => {
    const response = await fetch(diagramUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    return data;
}

const getDiagram = async (id: string | undefined) => {
    const diagramUrlGet = diagramUrl + "/" + id;
    const response = await fetch(diagramUrlGet, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    return data;
}

const createDiagram = async (arg: { name: string; }) => {
    const response = await fetch(diagramUrl, {
        method: "POST",
        body: JSON.stringify(arg),
        headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    return data;
}

const updateDiagram = async (arg: { id: string | undefined; nodes: CustomNode[]; connectors: CustomConnector[] }) => {
    console.log(arg);
    const diagramUrlUpdate = diagramUrl + "/" + arg.id;
    const response = await fetch(diagramUrlUpdate, {
        method: "PUT",
        body: JSON.stringify(arg),
        headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    return data;
}

const updateDiagramName = async (arg: { id: string | undefined; name: string; }) => {
    const diagramUrlUpdate = diagramUrl + "/name/" + arg.id;
    const response = await fetch(diagramUrlUpdate, {
        method: "PUT",
        body: JSON.stringify(arg),
        headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    return data;
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deleteDiagram = async (arg: { id: string }) => {
    const diagramUrlDelete = diagramUrl + "/" + arg.id;
    const response = await fetch(diagramUrlDelete, {
        method: "DELETE",
        body: JSON.stringify(arg),
        headers: { "Content-Type": "application/json" },
    });

    const data = response;
    return data;
}

export { getDiagrams, getDiagram, createDiagram, updateDiagram, updateDiagramName, deleteDiagram }