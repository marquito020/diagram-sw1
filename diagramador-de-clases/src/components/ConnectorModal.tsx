import { useState } from 'react';

type ConnectorModalProps = {
    onSubmit: (sourceId: string, targetId: string, relationship: string, multiplicity: string) => void;
    onClose: () => void;
    nodeOptions: { id: string; className: string }[]; // Prop para recibir los nodos existentes
};

const ConnectorModal: React.FC<ConnectorModalProps> = ({ onSubmit, onClose, nodeOptions }) => {
    const [selectedSource, setSelectedSource] = useState('');
    const [selectedTarget, setSelectedTarget] = useState('');
    const [relationship, setRelationship] = useState('Association');
    const [multiplicity, setMultiplicity] = useState('OneToOne');

    const handleSubmit = () => {
        onSubmit(selectedSource, selectedTarget, relationship, multiplicity);
        onClose();
    };

    // Lógica para cerrar el modal al hacer clic fuera del contenido
    const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-70" onClick={handleModalClick}>
            <div className="bg-white p-6 rounded shadow-md">
                <h2 className="text-xl font-bold mb-4">Create Connector</h2>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="sourceId">
                        Source Node:
                    </label>
                    <select
                        className="w-full border rounded px-3 py-2"
                        value={selectedSource}
                        onChange={(e) => setSelectedSource(e.target.value)}
                    >
                        <option value="">Select Source Node</option>
                        {nodeOptions.map((node) => (
                            <option key={node.id} value={node.id}>
                                {node.className}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="targetId">
                        Target Node:
                    </label>
                    <select
                        className="w-full border rounded px-3 py-2"
                        value={selectedTarget}
                        onChange={(e) => setSelectedTarget(e.target.value)}
                    >
                        <option value="">Select Target Node</option>
                        {nodeOptions.map((node) => (
                            <option key={node.id} value={node.id}>
                                {node.className}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="relationship">
                        Relationship:
                    </label>
                    <select
                        className="w-full border rounded px-3 py-2"
                        value={relationship}
                        onChange={(e) => setRelationship(e.target.value)}
                    >
                        <option value="Association">Association</option>
                        <option value="Aggregation">Aggregation</option>
                        <option value="Composition">Composition</option>
                        <option value="Inheritance">Inheritance</option>
                        <option value="Dependency">Dependency</option>
                    </select>
                </div>
                {/* Multiplicidad */}
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="multiplicity">
                        Multiplicity:
                    </label>
                    <select className="w-full border rounded px-3 py-2"
                        value={multiplicity}
                        onChange={(e) => setMultiplicity(e.target.value)}
                    >
                        <option value="OneToOne">Uno a Uno</option>
                        <option value="OneToMany">Uno a Muchos</option>
                        <option value="ManyToOne">Muchos a Uno</option>
                        <option value="ManyToMany">Muchos a Muchos</option>
                    </select>
                </div>

                <div className="flex justify-end">
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                    <button
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConnectorModal;
