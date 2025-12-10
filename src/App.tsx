import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Filmes from './pages/Filmes';
import Salas from './pages/Salas';
import Sessoes from './pages/Sessoes';
import Lanches from './pages/Lanches';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<div className="text-center"><h1>Bem-vindo ao CineWeb</h1></div>} />
          <Route path="/filmes" element={<Filmes />} />
          <Route path="/salas" element={<Salas />} />
          <Route path="/sessoes" element={<Sessoes />} />
          <Route path="/lanches" element={<Lanches />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;