import { RelationShipModel, Segments } from '@syncfusion/ej2-diagrams';
import  { useState } from 'react';

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

    const typeConversion: TypeConversion = {
        string: 'VARCHAR(255)',
        boolean: 'BOOLEAN',
        number: 'INT',
    };

    const generateScript = () => {
        let generatedScript = '';

        nodes.forEach((node) => {
            generatedScript += `CREATE TABLE ${node.className} (\n`;
            generatedScript += `  id INT PRIMARY KEY AUTO_INCREMENT,\n`; // Add ID column
            node.attributes.forEach((attribute) => {
                const convertedType = typeConversion[attribute.type];
                generatedScript += `  ${attribute.name} ${convertedType},\n`;
            });
            generatedScript += `);\n\n`;
        });

        connectors.forEach((connector) => {
            generatedScript += `ALTER TABLE ${connector.sourceID} ADD CONSTRAINT fk_${connector.sourceID}_${connector.targetID} FOREIGN KEY (${connector.sourceID}) REFERENCES ${connector.targetID} (id);\n\n`;
        });

        setScript(generatedScript);
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-70">
            <div className="bg-white p-6 rounded shadow-md max-w-md">
                <h2 className="text-xl font-bold mb-4">Script de Base de Datos</h2>

                <div>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded shadow"
                        onClick={generateScript}
                    >
                        Generar Script
                    </button>
                    <textarea
                        className="w-full border rounded px-3 py-2 mt-4"
                        rows={10}
                        value={script}
                        readOnly
                    />
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded shadow mt-4"
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
