import React, { useState } from 'react';

type ClassModalProps = {
  onSubmit: (className: string) => void;
  onClose: () => void; // Nuevo prop para manejar el cierre del modal
};

const ClassModal: React.FC<ClassModalProps> = ({ onSubmit, onClose }) => {
  const [className, setClassName] = useState('');

  const handleSubmit = () => {
    onSubmit(className);
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
        <h2 className="text-xl font-bold mb-4">Enter the class name:</h2>
        <input
          type="text"
          className="w-full border rounded px-3 py-2 mb-4"
          placeholder="Class Name"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        />
        <div className="flex justify-end">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
            onClick={handleSubmit}
          >
            Submit
          </button>
          {/* Botón para cerrar el modal */}
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

export default ClassModal;
