import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Tool from './pages/Tool';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/tool" element={<Tool />} />
    </Routes>
  );
}
