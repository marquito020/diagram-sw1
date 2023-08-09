import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../config/socket";
/* import { io } from 'socket.io-client'; */
import {
  DiagramComponent,
  Segments,
  ShapeAnnotationModel,
  RelationShipModel,
} from '@syncfusion/ej2-react-diagrams';

import ClassModal from '../components/ClassModal.tsx';

import AttributeModal from '../components/AttributeModal.tsx';

import ConnectorModal from '../components/ConnectorModal.tsx';

import { registerLicense } from '@syncfusion/ej2-base';
import { resetUser } from '../redux/states/user.state.ts';
import { getDiagram, updateDiagram } from '../services/diagram.service.ts';
import NodeModal from '../components/NodeModal.tsx';
import DatabaseScriptModal from '../components/DatabaseScriptModal.tsx';

let nodeId: string | null = null;

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

type CustomConnector = {
  id: string;
  sourceID: string;
  targetID: string;
  type: Segments,
  shape: RelationShipModel;
};

function createConnector(id: string, sourceID: string, targetID: string, relationship: string, multiplicity: string): CustomConnector {
  console.log("createConnector")
  const aegment: Segments = "Orthogonal";
  const relationshipDate: RelationShipModel = {
    relationship: relationship as 'Association' | 'Aggregation' | 'Composition' | 'Inheritance' | 'Dependency',
    type: "UmlClassifier",
    multiplicity: {
      type: multiplicity as 'OneToOne' | 'OneToMany' | 'ManyToOne' | 'ManyToMany',
    }
  };
  const connector: CustomConnector = {
    id: id,
    sourceID: sourceID,
    targetID: targetID,
    type: aegment,
    shape: relationshipDate,
  };
  return connector;
}


function createNode(id: string, offsetX: number, offsetY: number, className: string): CustomNode {
  console.log("createNode")
  const node: CustomNode = {
    id: id,
    offsetX: offsetX,
    offsetY: offsetY,
    className: className,
    attributes: [],
  };
  return node;
}

function createProperty(name: string, type: 'string' | 'boolean' | 'number'): Attribute {
  return { name: name, type: type };
}

function UMLClassDiagram() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [nodes, setNodes] = useState<CustomNode[]>([]);
  const [connectors, setConnectors] = useState<CustomConnector[]>([]);
  const diagramInstanceRef = useRef<DiagramComponent>(null); // Ref to store the diagram instance
  const [nodeIdCreateAtribute, setNodeIdCreateAtribute] = useState(null);
  const navigate = useNavigate();
  const params = useParams();

  // Nuevo estado para controlar la visibilidad del modal
  const [showModal, setShowModal] = useState(false);

  // Nuevo estado para almacenar el ID del nodo seleccionado
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Nuevo estado para controlar la visibilidad del modal de atributo
  const [showAttributeModal, setShowAttributeModal] = useState(false);

  // Nuevo estado para controlar la visibilidad del modal de agregar conector
  const [showConnectorModal, setShowConnectorModal] = useState(false);

  // Nuevo estado para controlar la visibilidad del modal de editar nodo
  const [showNodeModal, setShowNodeModal] = useState(false);

  // Nuevo estado para controlar la visibilidad del modal script de base de datos
  const [showDatabaseScriptModal, setShowDatabaseScriptModal] = useState(false);

  // Dentro del componente UMLClassDiagram
  const [nodeOptions, setNodeOptions] = useState<{ id: string; className: string }[]>([]);

  const [refresh, setRefresh] = useState(false);

  // Función para abrir el modal de script de base de datos
  const openDatabaseScriptModal = () => {
    setShowDatabaseScriptModal(true);
  };

  // Función para cerrar el modal de script de base de datos
  const closeDatabaseScriptModal = () => {
    setShowDatabaseScriptModal(false);
  };

  // Función para abrir el modal de editar nodo
  const openNodeModal = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    setShowNodeModal(true);
  };

  // Función para cerrar el modal de editar nodo
  const closeNodeModal = () => {
    setShowNodeModal(false);
  };


  // Función para abrir el modal de agregar conector
  const openConnectorModal = () => {
    setShowConnectorModal(true);
  };

  // Función para cerrar el modal de agregar conector
  const closeConnectorModal = () => {
    setShowConnectorModal(false);
  };

  // Función para manejar el envío del formulario de agregar conector
  const handleConnectorSubmit = (sourceID: string, targetID: string, relationship: string, multiplicity: string) => {
    addConnector(sourceID, targetID, relationship, multiplicity);
  };

  // Función para abrir el modal de atributo
  const openAttributeModal = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    setShowAttributeModal(true);
  };

  // Función para cerrar el modal de atributo
  const closeAttributeModal = () => {
    setShowAttributeModal(false);
    setSelectedNodeId(null);
  };

  // Función para manejar el envío del formulario de nodo
  const handleNodeSubmit = (nodeId: string, node: CustomNode) => {
    console.log(nodeId, node);
    /* Editar nodo */
    nodes.map((nodeGet) => {
      if (nodeGet.id === nodeId) {
        nodeGet.id = node.id;
        nodeGet.className = node.className;
        nodeGet.offsetX = node.offsetX;
        nodeGet.offsetY = node.offsetY;
        nodeGet.attributes = node.attributes;
      }
    });
    setNodes(nodes);
    closeNodeModal();
  };

  // Función para manejar el envío del formulario de atributo
  const handleAttributeSubmit = (nodeId: string, attributeName: string, attributeType: 'string' | 'boolean' | 'number') => {
    addAttribute(nodeId, attributeName, attributeType);
    closeAttributeModal();
  };

  const handleClassSubmit = (className: string) => {
    // Aquí puedes manejar la lógica cuando se envía el formulario del modal.
    addNode(100, 100, className);
    console.log('Class name submitted:', className);
  };

  function addNode(offsetX: number, offsetY: number, className: string) {
    const newNode = createNode(`Node${nodes.length + 1}`, offsetX, offsetY, className);
    setNodes([...nodes, newNode]);

    // Actualizar nodeOptions con el nuevo nodo agregado
    setNodeOptions([...nodeOptions, { id: newNode.id, className: newNode.className }]);

    const data = {
      id: params._id,
      nodes: [...nodes, newNode],
      connectors: connectors,
    };
    updateDiagram(data);
  }


  function addConnector(sourceID: string, targetID: string, relationship: string, multiplicity: string) {
    const newConnector = createConnector(`Connector${connectors.length + 1}`, sourceID, targetID, relationship, multiplicity);
    setConnectors([...connectors, newConnector]);
    console.log(connectors)

    const data = {
      id: params._id,
      nodes: nodes,
      connectors: [...connectors, newConnector],
    };
    updateDiagram(data);
  }

  function addAttribute(nodeId: string, attributeName: string, attributeType: 'string' | 'boolean' | 'number') {
    const newNodeAttributes = nodes.map((node) => {
      if (node.id === nodeId) {
        // Add a new attribute with default values
        node.attributes.push(createProperty(attributeName, attributeType));
      }
      return node;
    });
    console.log(newNodeAttributes);
    setNodes(newNodeAttributes);

    const data = {
      id: params._id,
      nodes: newNodeAttributes,
      connectors: connectors,
    };
    updateDiagram(data);
  }

  const handleNodePositionChange = async (args: { source: { id: string | null | undefined }; state: string; newValue: { offsetX: number; offsetY: number } }) => {
    if (args.source.id !== 'helper' && args.source.id !== undefined) {
      nodeId = args.source.id;
    }

    if (nodeId && args.state === 'Completed') {
      const newNodePosition = nodes.map((node) => {
        if (node.id === nodeId) {
          node.offsetX = args.newValue.offsetX;
          node.offsetY = args.newValue.offsetY;
          /* console.log(args); */
        }
        return node;
      });
      const data = {
        id: params._id,
        nodes: newNodePosition,
        connectors: connectors,
      };

      /* newNodePosition.map((node) => {
        diagramInstanceRef.current?.add(node);
      }); */

      updateDiagram(data);
      setNodes(newNodePosition);
      // Construye conectores cuando se agrega un nuevo nodo o se actualiza la posición de un nodo
      connectors.map((connector) => {
        /* console.log(connector); */
        diagramInstanceRef.current?.add(connector);
      });
      setRefresh(true);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function handleClicked({ args }: { args: any; }) {
    /* console.log(args); */
    if (args.element.children) {
      nodeId = args.element.id;
      console.log('Node clicked', args.element.children);
    }

    if (args.element && args.element.id && args.element.shape && args.element.shape.classShape) {
      /* nodeIdCreateAtribute = args.element.id; */
      setNodeIdCreateAtribute(args.element.id);
    } else {
      /* nodeIdCreateAtribute = null; */
      setNodeIdCreateAtribute(null);
    }
  }

  // Creamos un estado para almacenar el tamaño del contenedor
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const diagramContainerRef = useRef<HTMLDivElement>(null);

  /* const [socket, setSocket] = useState(null); */

  // Utilizamos useEffect para actualizar el tamaño del contenedor cuando cambia el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      if (diagramContainerRef.current) {
        setContainerSize({
          width: diagramContainerRef.current.offsetWidth,
          height: diagramContainerRef.current.offsetHeight,
        });
      }
    };
    getDiagramData();

    console.log('Se ejecuto el useEffect');

    // Agregamos un listener para el evento de cambio de tamaño de la ventana
    window.addEventListener('resize', handleResize);

    // Llamamos a la función de manejo de cambio de tamaño una vez al inicio para obtener el tamaño inicial del contenedor
    handleResize();

    // Importante: limpiar el listener cuando el componente se desmonta para evitar memory leaks
    return () => {
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params._id]);

  /* useEffect(() => {
    const socket = io('http://127.0.0.1:4000');
    setSocket(socket);
    return () => {
      socket.disconnect();
    };
  }, []); */

  useEffect(() => {

    if (socket) {
      socket.on('diagramUpdate', handleDiagramUpdate);
      console.log('socket', socket);
    }

    return () => {
      if (socket) {
        socket.off('diagramUpdate', handleDiagramUpdate);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, refresh]);

  useEffect(() => {
    console.log('Se ejecuto el useEffect de nodes');
    connectors.map((connector) => {
      diagramInstanceRef.current?.add(connector);
    });
  }, [connectors, nodes]);

  const getDiagramData = async () => {
    const diagramData = await getDiagram(params._id);
    console.log("Creando Diagrama Inicial");

    if (diagramData.nodes === undefined) {
      setNodes([]);
      setNodeOptions([]);
    } else {
      setNodes(diagramData.nodes);
      setNodeOptions(diagramData.nodes);
    }

    if (diagramData.connectors === undefined) {
      setConnectors([]);
    } else {
      setConnectors(diagramData.connectors);
    }

    /* setNodes(diagramData.nodes);
    setConnectors(diagramData.connectors);
    setNodeOptions(diagramData.nodes); */
  };

  const handleDiagramUpdate = async (data: unknown) => {
    // Aquí puedes realizar acciones cuando ocurra el evento 'diagramUpdate'
    console.log('Estoy en el useEffect');
    console.log(data);
    if (!refresh) {

      /* const nodes = await data.nodes;
      const connectors = await data.connectors;

      setNodes(nodes);
      setConnectors(connectors);
      setNodeOptions(nodes); */
      const diagramData = await getDiagram(params._id);
      /* console.log("Creando Diagrama Inicial"); */
      setNodes(diagramData.nodes);
      setConnectors(diagramData.connectors);
      setNodeOptions(diagramData.nodes);

    }
    setRefresh(false);
  };

  registerLicense(
    'Ngo9BigBOggjHTQxAR8/V1NGaF1cWmhAYVVpR2NbfE5xfldDalhSVAciSV9jS31TfkVkWX5cdnVRQmNaWQ=='
  );

  const handleLogout = () => {
    // Aquí puedes agregar la lógica para cerrar sesión
    dispatch(resetUser());
    navigate('/login');
    // Redirigir o realizar otras acciones después de cerrar sesión
  };

  return (
    <div className="control-section">
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
      <div ref={diagramContainerRef} style={{ width: '100%', height: '600px' }}>

        <h1 className="text-4xl text-center font-bold text-gray-800 mb-4">DIAGRAMA DE CLASES UML</h1>
        <div className='p-3'>
          {/* Botón para abrir el modal */}
          <button onClick={() => setShowModal(true)} className="bg-green-500 mr-3 hover:bg-green-600 text-white px-4 py-2 rounded">
            Añadir Clase
          </button>
          {/* <button onClick={() => addConnector('Node1', 'Node2', 'Aggregation')} className='
          bg-green-500 mr-3 hover:bg-green-600 text-white px-4 py-2 rounded
          '>Añadir Conector</button> */}
          <button onClick={openConnectorModal} className='
          bg-green-500 mr-3 hover:bg-green-600 text-white px-4 py-2 rounded
          '>Añadir Conector</button>
          {/* {nodes.map((node) => (
            <button key={node.id} onClick={() => openAttributeModal(node.id)}>
              Add Attribute to {node.id}
            </button>
          ))} */}
          {nodeIdCreateAtribute && (
            <button className='bg-green-500 mr-3 hover:bg-green-600 text-white px-4 py-2 rounded'
              onClick={() => openAttributeModal(nodeIdCreateAtribute)}>Añadir Atributo</button>
          )}

          {/* Botón para abrir el modal de editar nodo */}
          {nodeIdCreateAtribute && (
            <button className='bg-green-500 mr-3 hover:bg-green-600 text-white px-4 py-2 rounded'
              onClick={() => openNodeModal(nodeIdCreateAtribute)}>Editar Nodo</button>
          )}

          {/* Boton para abrir el modal de script base de datos */}
          <button className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded'
            onClick={openDatabaseScriptModal}>Script Base de Datos</button>

        </div>
        <DiagramComponent
          id="diagram"
          width={containerSize.width.toString()} // Usamos el ancho del contenedor como el ancho del DiagramComponent
          height={containerSize.height.toString()} // Usamos la altura del contenedor como la altura del DiagramComponent
          ref={diagramInstanceRef}
          positionChange={args => handleNodePositionChange(args)}

          click={args => handleClicked({ args })}
          nodes={nodes.map((node) => ({
            id: node.id,
            offsetX: node.offsetX,
            offsetY: node.offsetY,
            shape: {
              type: 'UmlClassifier',
              classShape: {
                name: node.className,
                attributes: node.attributes.map((attr) => createProperty(attr.name, attr.type)),
              },
              classifier: 'Class',
            },
          }))}

          /* connectors={connectors.map((connector) => ({
            id: connector.id,
            sourceID: connector.sourceID,
            targetID: connector.targetID,
            type: connector.type,
            shape: connector.shape,
          }))} */

          getNodeDefaults={(obj: { style: { fill: string; strokeColor: string; }; }) => {
            obj.style = { fill: '#26A0DA', strokeColor: 'white' };
            return obj;
          }}

          /* Estilos para los conectores */
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          getConnectorDefaults={(connector: any) => {
            connector.style.strokeColor = '#8D8D8D';
            connector.style.strokeWidth = 3;
            connector.targetDecorator.style.fill = '#8D8D8D';
            connector.targetDecorator.style.strokeColor = '#8D8D8D';
            /* connector.targetDecorator.style.strokeWidth = 3; */

            connector.cornerRadius = 15;

            return connector;
          }}

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setNodeTemplate={(node: { annotations: string | any[]; }) => {
            if (node.annotations && node.annotations.length > 0) {
              for (let i: number = 0; i < node.annotations.length; i++) {
                const annotation: ShapeAnnotationModel = node.annotations[i];
                if (annotation && annotation.style) {
                  annotation.style.color = 'white';
                }
              }
            }
          }}
        />
        {/* {nodes.map((node) => (
          <button key={node.id} onClick={() => addAttribute(node.id)}>
            Add Attribute to {node.id}
          </button>
        ))} */}

      </div>
      {/* Modal para agregar la clase */}
      {showModal && <ClassModal onSubmit={handleClassSubmit} onClose={() => setShowModal(false)} />}
      {/* Modal para agregar atributo */}
      {showAttributeModal && (
        <AttributeModal
          nodeId={selectedNodeId}
          node={
            nodes.find((node) => node.id === selectedNodeId) || {
              id: '',
              className: '',
              offsetX: 100,
              offsetY: 100,
              attributes: [],
            }
          }
          onSubmit={handleAttributeSubmit}
          onClose={closeAttributeModal}
        />
      )}
      {/* Modal para agregar conector */}
      {showConnectorModal && (
        <ConnectorModal
          onSubmit={handleConnectorSubmit}
          onClose={closeConnectorModal}
          nodeOptions={nodeOptions.map((node) => ({
            id: node.id,
            className: node.className,
          }))
          }
        />
      )}

      {/* Modal para editar nodo */}
      {showNodeModal && (
        <NodeModal
          nodeId={selectedNodeId}
          node={
            nodes.find((node) => node.id === selectedNodeId) || {
              id: '',
              className: '',
              offsetX: 100,
              offsetY: 100,
              attributes: [],
            }
          }
          onSubmit={handleNodeSubmit}
          onClose={closeNodeModal}
        />
      )}

      {/* Modal para script base de datos */}
      {showDatabaseScriptModal && (
        <DatabaseScriptModal
          nodes={nodes}
          connectors={connectors}
          onClose={closeDatabaseScriptModal}
        />
      )}

    </div>
  );
}

export default UMLClassDiagram;