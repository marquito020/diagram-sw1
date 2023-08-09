import React, { useState } from 'react';

import { LoginCustomForm } from "../interfaces/auth.interface";
import { useLogin } from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { createUser } from '../redux/states/user.state';

const Login: React.FC = () => {
    const dispatch = useDispatch();
    const { loginUser } = useLogin();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [messageError, setMessageError] = useState("");

    const handleSubmit = async (e: React.FormEvent<LoginCustomForm>) => {
        e.preventDefault();

        const elements = e.currentTarget.elements;
        const email = elements.email.value;
        const password = elements.password.value;

        console.log('Email:', email);
        console.log('Contraseña:', password);

        try {
            const response = await loginUser({ email, password });
            console.log(response);
            if (response?.email) {
                dispatch(createUser(response));
                setMessageError("");
                window.location.href = "/diagram";
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
                <h2 className="text-2xl font-bold text-center mb-6">Iniciar sesión</h2>
                <form onSubmit={handleSubmit}>
                <p className="text-red-500">{messageError}</p>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                            placeholder="Ingrese su email"
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
                            Iniciar sesión
                        </button>
                    </div>

                    {/* ¿No tines un cuenta? Registrate aqui*/}
                    <div className="text-center mt-4">
                        <h1>
                            ¿No tienes una cuenta?
                        </h1>
                        <a href="register" className="
                            text-blue-500 hover:text-blue-600 font-semibold
                        ">
                            Registrate aquí
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
