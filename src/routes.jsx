import { Route, Routes } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import Shop from './pages/Shop';

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="shop" element={<Shop />} />
    </Route>
  </Routes>
);