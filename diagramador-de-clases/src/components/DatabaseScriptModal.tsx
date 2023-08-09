import { RelationShipModel, Segments } from '@syncfusion/ej2-diagrams';
import { useState } from 'react';

type Attribute = {
    name: string;
    type: 'string' | 'boolean' | 'number';
};

type TypeConversion = {
    string: 'VARCHAR(255)';
    boolean: 'BOOLEAN';
    number: 'INT';
};

type CustomNode = {
    id: string;
    offsetX: number;
    offsetY: number;
    className: string;
    attributes: Attribute[];
};

type CustomConnector = {
    id: string;
    sourceID: string;
    targetID: string;
    type: Segments;
    shape: RelationShipModel;
};

type DatabaseScriptModalProps = {
    nodes: CustomNode[];
    connectors: CustomConnector[];
    onClose: () => void;
};

const DatabaseScriptModal: React.FC<DatabaseScriptModalProps> = ({
    nodes,
    connectors,
    onClose,
}) => {
    const [script, setScript] = useState<string>('');
    const [selectedDbType, setSelectedDbType] = useState<string>('');

    const typeConversion: TypeConversion = {
        string: 'VARCHAR(255)',
        boolean: 'BOOLEAN',
        number: 'INT',
    };

    const generateScript = () => {
        let generatedScript = '';

        if (selectedDbType === 'SqlServer') {
            nodes.forEach((node) => {

                generatedScript += `CREATE TABLE ${node.className} (\n`;
                generatedScript += `  id INT PRIMARY KEY NOT NULL IDENTITY(1,1),\n`;
                node.attributes.forEach((attribute) => {
                    const convertedType = typeConversion[attribute.type];
                    generatedScript += `  ${attribute.name} ${convertedType},\n`;
                });
                generatedScript += `);\n\n`;
            });

            connectors.forEach((connector) => {
                const sourceNode = nodes.find((node) => node.id === connector.sourceID);
                const targetNode = nodes.find((node) => node.id === connector.targetID);

                if (sourceNode && targetNode) {
                    generatedScript += `ALTER TABLE ${sourceNode.className} ADD CONSTRAINT fk_${sourceNode.className}_${targetNode.className} FOREIGN KEY (id) REFERENCES ${targetNode.className} (id);\n\n`;
                }
            });

            setScript(generatedScript);
            return;
        } else if (selectedDbType === 'MariaDB') {
            nodes.forEach((node) => {
                generatedScript += `CREATE TABLE ${node.className} (\n`;
                generatedScript += `  id INT PRIMARY KEY,\n`;
                node.attributes.forEach((attribute) => {
                    const convertedType = typeConversion[attribute.type];
                    if (node.attributes.indexOf(attribute) === node.attributes.length - 1) {
                        generatedScript += `  ${attribute.name} ${convertedType}\n`;
                    } else {
                        generatedScript += `  ${attribute.name} ${convertedType},\n`;
                    }
                });
                generatedScript += `);\n\n`;
            });

            connectors.forEach((connector) => {
                const sourceNode = nodes.find((node) => node.id === connector.sourceID);
                const targetNode = nodes.find((node) => node.id === connector.targetID);

                if (sourceNode && targetNode) {
                    generatedScript += `ALTER TABLE ${sourceNode.className} ADD CONSTRAINT fk_${sourceNode.className}_${targetNode.className} FOREIGN KEY (id) REFERENCES ${targetNode.className} (id);\n\n`;
                }
            });

            setScript(generatedScript);
            return;
        } else if (selectedDbType === 'Postgres') {
            nodes.forEach((node) => {
                generatedScript += `CREATE TABLE ${node.className} (\n`;
                generatedScript += `  id INT PRIMARY KEY,\n`;
                node.attributes.forEach((attribute) => {
                    const convertedType = typeConversion[attribute.type];
                    if (node.attributes.indexOf(attribute) === node.attributes.length - 1) {
                        generatedScript += `  ${attribute.name} ${convertedType}\n`;
                    } else {
                        generatedScript += `  ${attribute.name} ${convertedType},\n`;
                    }
                });
                generatedScript += `);\n\n`;
            });

            connectors.forEach((connector) => {
                const sourceNode = nodes.find((node) => node.id === connector.sourceID);
                const targetNode = nodes.find((node) => node.id === connector.targetID);

                if (sourceNode && targetNode) {
                    generatedScript += `ALTER TABLE ${sourceNode.className} ADD CONSTRAINT fk_${sourceNode.className}_${targetNode.className} FOREIGN KEY (id) REFERENCES ${targetNode.className} (id);\n\n`;
                }
            });

            setScript(generatedScript);
            return;
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-70">
            <div className="bg-white p-6 rounded shadow-md max-w-md">
                <h2 className="text-xl font-bold mb-4">Script de Base de Datos</h2>

                <div>
                    <div className="mb-4">
                        <button
                            className={`bg-blue-500 text-white px-4 py-2 rounded shadow ${selectedDbType === 'SqlServer' ? 'bg-blue-600' : ''}`}
                            onClick={() => {
                                setSelectedDbType('SqlServer');
                                generateScript();
                            }}
                        >
                            Generar Script para SqlServer
                        </button>
                        <button
                            className={`mt-3 bg-green-500 text-white px-4 py-2 rounded shadow ${selectedDbType === 'OracleSql' ? 'bg-green-600' : ''}`}
                            onClick={() => {
                                setSelectedDbType('MariaDB');
                                generateScript();
                            }}
                        >
                            Generar Script para MariaDB
                        </button>
                        <button
                            className={`mt-3 bg-purple-500 text-white px-4 py-2 rounded shadow ${selectedDbType === 'Postgres' ? 'bg-purple-600' : ''}`}
                            onClick={() => {
                                setSelectedDbType('Postgres');
                                generateScript();
                            }}
                        >
                            Generar Script para Postgres
                        </button>
                    </div>
                    <textarea
                        className="w-full border rounded px-3 py-2 mt-2 mb-4"
                        rows={10}
                        value={script}
                        readOnly
                    />
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded shadow"
                        onClick={onClose}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DatabaseScriptModal;
