import React, { useState, useEffect } from 'react';

type Attribute = {
    name: string;
    type: 'string' | 'boolean' | 'number';
};

type CustomNode = {
    id: string;
    offsetX: number;
    offsetY: number;
    className: string;
    attributes: Attribute[];
};

type NodeModalProps = {
    nodeId: string | null;
    node: CustomNode;
    onSubmit: (nodeId: string, updatedNode: CustomNode) => void;
    onClose: () => void;
};

const NodeModal: React.FC<NodeModalProps> = ({ nodeId, node, onSubmit, onClose }) => {
    const [className, setClassName] = useState('');
    const [attributes, setAttributes] = useState<Attribute[]>([]);

    useEffect(() => {
        setClassName(node.className);
        setAttributes([...node.attributes]);
    }, [node]);

    const handleSubmit = () => {
        if (nodeId) {
            const updatedNode: CustomNode = {
                ...node,
                className: className,
                attributes: attributes,
            };
            /* console.log(updatedNode); */
            onSubmit(nodeId, updatedNode);
        }
    };

    // Detener la propagación del evento clic dentro del modal
    const stopPropagation = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-70">
            <div className="bg-white p-6 rounded shadow-md max-w-md" onClick={stopPropagation}>
                <h2 className="text-xl font-bold mb-4">Editar Nodo</h2>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Node Id: {nodeId}</h3>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Class Name"
                            value={className}
                            onChange={(e) => setClassName(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Attributes:</h3>
                        {attributes.map((attribute, index) => (
                            <div className="mb-2 flex items-center" key={index}>
                                <div className="mb-4 mr-2">
                                    <input
                                        type="text"
                                        placeholder="Attribute Name"
                                        value={attribute.name}
                                        onChange={(e) => {
                                            const newAttributes = [...attributes];
                                            newAttributes[index].name = e.target.value;
                                            setAttributes(newAttributes);
                                        }}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>
                                <div className="mb-4">
                                    <select
                                        value={attribute.type}
                                        onChange={(e) => {
                                            const newAttributes = [...attributes];
                                            newAttributes[index].type = e.target.value as 'string' | 'number' | 'boolean';
                                            setAttributes(newAttributes);
                                        }}
                                        className="w-full border rounded px-3 py-2"
                                    >
                                        <option value="string">string</option>
                                        <option value="number">number</option>
                                        <option value="boolean">boolean</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <button
                                        onClick={() => {
                                            const newAttributes = [...attributes];
                                            newAttributes.splice(index, 1);
                                            setAttributes(newAttributes);
                                        }}
                                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded ml-2"
                                    >
                                        X
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mb-4">
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded shadow"
                            onClick={handleSubmit}
                        >
                            Save
                        </button>
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded shadow ml-2"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default NodeModal;
