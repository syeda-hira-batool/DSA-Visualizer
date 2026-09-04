import { Routes, Route } from 'react-router-dom';
import Background from './MyComponents/Background';
import Categories from './MyComponents/Categories';
import SortingHub from './MyComponents/Sortinghub';
import SortVisualizer from './MyComponents/Sortvisualizer';

function Home() {
  return (
    <>
      <Background />
      <Categories />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sorting" element={<SortingHub />} />
      <Route path="/sorting/:algoId" element={<SortVisualizer />} />
    </Routes>
  );
}