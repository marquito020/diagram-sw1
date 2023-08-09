import { BrowserRouter, Routes, Route } from "react-router-dom";

import UMLClassDiagram from './pages/UMLClassDiagram.tsx';
import Login from "./pages/login.tsx";
import Register from "./pages/register.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import Diagrams from "./pages/Diagrams.tsx";

/* import './App.css'; */

function App() {

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/diagram" element={<Diagrams />} />
          <Route path="/diagram/:_id" element={<UMLClassDiagram />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
