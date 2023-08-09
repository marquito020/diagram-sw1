import React, { useEffect, useState } from 'react';
import { createDiagram, deleteDiagram, getDiagrams, updateDiagramName } from '../services/diagram.service';
import { resetUser } from '../redux/states/user.state';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";

const Diagrams: React.FC = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [diagrams, setDiagrams] = useState<any[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false); // Estado para controlar la visibilidad del modal
    const [newDiagramName, setNewDiagramName] = useState("");
    const [messageError, setMessageError] = useState("");

    const [showEditModal, setShowEditModal] = useState(false); // Estado para controlar la visibilidad del modal de edición
    const [editedDiagramId, setEditedDiagramId] = useState(""); // Estado para almacenar el ID del diagrama a editar
    const [editedDiagramName, setEditedDiagramName] = useState(""); // Estado para almacenar el nombre editado del diagrama

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getDiagrams();
                setDiagrams(data);
            } catch (error) {
                console.error('Error fetching diagrams:', error);
            }
        };

        fetchData();
    }, []);

    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();

    const handleLogout = () => {
        // Aquí puedes agregar la lógica para cerrar sesión
        dispatch(resetUser());
        navigate('/login');
        // Redirigir o realizar otras acciones después de cerrar sesión
    };

    const handleCreateDiagram = () => {
        setShowCreateModal(true);
    };

    const handleCloseModal = () => {
        setShowCreateModal(false);
    };

    const handleCreateModalSubmit = async () => {
        // Aquí puedes agregar la lógica para crear un nuevo diagrama con el nombre "newDiagramName"
        const data = {
            name: newDiagramName,
        };
        const response = await createDiagram(data);
        if (response?._id) {
            setDiagrams([...diagrams, response]);
        } else if (response && "message" in response) {
            console.log(response.message);
            setMessageError(response.message as string);
        }
        console.log(response);
        // Luego puedes cerrar el modal y actualizar la lista de diagramas
        setShowCreateModal(false);
        setNewDiagramName(""); // Limpiar el campo de nombre del diagrama
    };

    const handleDeleteDiagram = async (id: string) => {
        // Aquí puedes agregar la lógica para eliminar un diagrama
        // Luego puedes actualizar la lista de diagramas
        const response = await deleteDiagram({ id });
        console.log(response);
        if (response) {
            const newDiagrams = diagrams.filter((diagram) => diagram._id !== id);
            setDiagrams(newDiagrams);
        } else {
            console.log("Error al eliminar el diagrama");
        }
    };

    const handleEditDiagram = async (id: string, name: string) => {
        setEditedDiagramId(id);
        setEditedDiagramName(name);
        setShowEditModal(true);
    };

    const handleEditModalSubmit = async () => {
        // Aquí puedes agregar la lógica para editar el nombre de un diagrama
        const data = {
            id : editedDiagramId,
            name: editedDiagramName,
        };

        const response = await updateDiagramName(data);
        if (response?._id) {
            // Actualizar el nombre del diagrama en la lista
            const updatedDiagrams = diagrams.map((diagram) => {
                if (diagram._id === editedDiagramId) {
                    return { ...diagram, name: editedDiagramName };
                }
                return diagram;
            });
            setDiagrams(updatedDiagrams);
        } else if (response && "message" in response) {
            console.log(response.message);
            setMessageError(response.message as string);
        }
        setShowEditModal(false);
        setEditedDiagramId("");
        setEditedDiagramName("");
    };


    return (
        <div>
            <nav className="bg-blue-500 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <a className="text-white font-bold text-xl" href="/diagram">
                        UML Diagram
                    </a>
                    <div className="flex items-center space-x-4">
                        <span className="text-white font-semibold">
                            {user.firstName} {user.lastName}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded focus:outline-none focus:shadow-outline"
                        >
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </nav>
            <div className="container mx-auto mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Lista de Diagramas</h1>
                    <button
                        onClick={handleCreateDiagram}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded focus:outline-none focus:shadow-outline"
                    >
                        Crear Diagrama
                    </button>
                </div>
                <p className="text-red-500">{messageError}</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {diagrams.map((diagram) => (
                        <li key={diagram._id} className="bg-white p-4 shadow rounded-lg">
                            <h2 className="text-lg font-semibold mb-2">{diagram.name}</h2>
                            <p className="text-gray-500">{diagram._id}</p>
                            <a
                                href={`/diagram/${diagram._id}`}
                                className="mt-2 mr-3 inline-block bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded focus:outline-none focus:shadow-outline"
                            >
                                Ver
                            </a>

                            {/* Delete */}
                            <button
                                onClick={() => handleDeleteDiagram(diagram._id)}
                                className="mt-2 mr-3 inline-block bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded focus:outline-none focus:shadow-outline"
                            >
                                Eliminar
                            </button>

                            {/* Editar */}
                            <button
                                onClick={() => handleEditDiagram(diagram._id, diagram.name)}
                                className="mt-2 inline-block bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded focus:outline-none focus:shadow-outline"
                            >
                                Editar
                            </button>

                        </li>
                    ))}
                </ul>
            </div>
            {/* Modal para crear diagrama */}
            {showCreateModal && (
                <div className="fixed inset-0 flex items-center justify-center z-10">
                    <div className="bg-white p-6 rounded shadow-md w-1/3">
                        <h2 className="text-lg font-semibold mb-2">Crear Diagrama</h2>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500 mb-4"
                            placeholder="Nombre del Diagrama"
                            value={newDiagramName}
                            onChange={(e) => setNewDiagramName(e.target.value)}
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={handleCreateModalSubmit}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded focus:outline-none focus:shadow-outline"
                            >
                                Crear
                            </button>
                            <button
                                onClick={handleCloseModal}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 ml-2 px-4 py-2 rounded focus:outline-none focus:shadow-outline"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showEditModal && (
                <div className="fixed inset-0 flex items-center justify-center z-10">
                    <div className="bg-white p-6 rounded shadow-md w-1/3">
                        <h2 className="text-lg font-semibold mb-2">Editar Nombre del Diagrama</h2>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500 mb-4"
                            placeholder="Nuevo Nombre del Diagrama"
                            value={editedDiagramName}
                            onChange={(e) => setEditedDiagramName(e.target.value)}
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={handleEditModalSubmit}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded focus:outline-none focus:shadow-outline"
                            >
                                Guardar
                            </button>
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setEditedDiagramId("");
                                    setEditedDiagramName("");
                                }}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 ml-2 px-4 py-2 rounded focus:outline-none focus:shadow-outline"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

};

export default Diagrams;
