import  { useState } from 'react';

import { RegisterCustomForm } from '../interfaces/user.interface';
import { useRegister } from '../hooks/useRegister';

const Register: React.FC = () => {
    const { registerUser } = useRegister();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [messageError, setMessageError] = useState("");

    const handleSubmit = async (e: React.FormEvent<RegisterCustomForm>) => {
        e.preventDefault();
        // Aquí puedes agregar la lógica para registrar al usuario
        const elements = e.currentTarget.elements;
        const firstName = elements.firstName.value;
        const lastName = elements.lastName.value;
        const email = elements.email.value;
        const password = elements.password.value;

        try {
            const response = await registerUser({ firstName, lastName, email, password });
            if (response?.email) {
                window.location.href = "/";
            } else if (response && "mensaje" in response) {
                setMessageError(response.mensaje as string);
            }

        } catch (error) {
            setMessageError("Ocurrio un error en el servidor");
            console.log(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center">
            <div className="max-w-md w-full mx-auto p-8 bg-white border rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Registrarse</h2>
                <form onSubmit={handleSubmit}>
                <p className="text-red-500">{messageError}</p>
                    <div className="mb-4">
                        <label htmlFor="firstName" className="block text-gray-700 font-semibold mb-2">
                            Nombres
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                            placeholder="Ingrese sus nombres"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="lastName" className="block text-gray-700 font-semibold mb-2">
                            Apellidos
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                            placeholder="Ingrese sus apellidos"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                            Correo
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                            placeholder="Ingrese su correo"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                            placeholder="Ingrese su contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Registrarse
                        </button>
                    </div>

                    {/* ¿Ya tienes una cuenta? Igresa Sesion */}
                    <div className="text-center mt-4">
                        <h1 className="text-gray-500 text-sm">
                            ¿Ya tienes una cuenta?
                        </h1>
                        <a
                            href="/"
                            className="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800"
                        >
                            Ingresar
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
