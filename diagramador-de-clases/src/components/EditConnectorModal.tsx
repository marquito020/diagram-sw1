import { RelationShipModel, Segments } from '@syncfusion/ej2-diagrams';
import { useEffect, useState } from 'react';

type Conector = {
    id: string;
    sourceID: string;
    targetID: string;
    type: Segments;
    shape: RelationShipModel;
};

type EditConnectorModalProps = {
    connectorId: string | null;
    connector: Conector;
    onSubmit: (connectorId: string, updatedConnector: Conector) => void;
    onClose: () => void;
};

const EditConnectorModal: React.FC<EditConnectorModalProps> = ({
    connectorId,
    connector,
    onSubmit,
    onClose,
}) => {
    const [relationship, setRelationship] = useState<string>('');
    const [multiplicity, setMultiplicity] = useState<string>('');

    useEffect(() => {
        setRelationship(connector.shape.relationship?.toString() || '');
        setMultiplicity(connector.shape.multiplicity?.type?.toString() || '');
    }, [connector]);

    const handleSubmit = () => {
        if (connectorId) {
            const relationshipDate: RelationShipModel = {
                relationship: relationship as 'Association' | 'Aggregation' | 'Composition' | 'Inheritance' | 'Dependency',
                type: "UmlClassifier",
                multiplicity: {
                    type: multiplicity as 'OneToOne' | 'OneToMany' | 'ManyToOne' | 'ManyToMany',
                }
            };

            const updatedConnector: Conector = {
                ...connector,
                shape: relationshipDate,
            };
            onSubmit(connectorId, updatedConnector);
        }
    };

    // Detener la propagación del evento clic dentro del modal
    const stopPropagation = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-70">
            <div className="bg-white p-6 rounded shadow-md max-w-md" onClick={stopPropagation}>
                <h2 className="text-xl font-bold mb-4">Edit Connector</h2>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Connector Id: {connectorId}</h3>
                    <div className="mb-4">
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
                    <div className="mb-4">
                        <select
                            className="w-full border rounded px-3 py-2"
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
                            className="px-4 py-2 rounded bg-red-600 text-white mr-2"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 rounded bg-blue-600 text-white"
                            onClick={handleSubmit}
                        >
                            Update
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditConnectorModal;
