import React, { useState } from 'react';

type Attribute = {
    name: string;
    type: 'string' | 'boolean' | 'number';
};

type AttributeModalProps = {
    nodeId: string | null;
    node: { id: string; offsetX: number, offsetY: number, className: string, attributes: Attribute[] }; // Prop para recibir los nodos existentes
    onSubmit: (nodeId: string, attributeName: string, attributeType: 'string' | 'boolean' | 'number') => void;
    onClose: () => void;
};

const AttributeModal: React.FC<AttributeModalProps> = ({ nodeId, node, onSubmit, onClose, }) => {
    const [attributeName, setAttributeName] = useState('');
    const [attributeType, setAttributeType] = useState<'string' | 'boolean' | 'number'>('string');

    const handleSubmit = () => {
        if (nodeId) {
            onSubmit(nodeId, attributeName, attributeType);
        }
    };

    // Detener la propagación del evento clic dentro del modal
    const stopPropagation = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-70">
            <div className="bg-white p-6 rounded shadow-md" onClick={stopPropagation} style={{ maxWidth: '400px' }}>
                <h2 className="text-xl font-bold mb-4">Add Attribute</h2>
                {/* Resto del contenido... */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Node Id: {nodeId}</h3>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Attribute Name"
                            value={attributeName}
                            onChange={(e) => setAttributeName(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                    <div className="mb-4">
                        <select
                            value={attributeType}
                            onChange={(e) => setAttributeType(e.target.value as 'string' | 'number' | 'boolean')}
                            className="w-full border rounded px-3 py-2"
                        >
                            <option value="string">string</option>
                            <option value="number">number</option>
                            <option value="boolean">boolean</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        {/* Editar Atributos */}
                        <h3 className="text-lg font-semibold mb-2">Attributes:</h3>
                        {node.attributes.map((attribute) => (
                            <div className="flex justify-between items-center mb-2">
                                <span>{attribute.name}</span>
                                <span>{attribute.type}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={handleSubmit}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
                        >
                            Add Attribute
                        </button>
                        {/* Botón para cerrar el modal */}
                        <button
                            onClick={onClose}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default AttributeModal;