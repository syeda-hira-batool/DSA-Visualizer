import { Routes, Route } from 'react-router-dom';
import Background from './MyComponents/Background';
import Categories from './MyComponents/Categories';
import SortingHub from './MyComponents/SortingHub';
import SortVisualizer from './MyComponents/SortVisualizer';
import LinkedListHub from './MyComponents/LinkedListHub';
import LinkedListVisualizer from './MyComponents/LinkedListVisualizer';

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
      <Route path="/linkedlist" element={<LinkedListHub />} />
      <Route path="/linkedlist/:listId" element={<LinkedListVisualizer />} />
    </Routes>
  );
}