import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { AllRecords } from './pages/AllRecords';
import { Calculator } from './pages/Calculator';
import { Login } from './pages/Login';
import { ProductPage } from './pages/ProductPage';
import { ProductsIndex } from './pages/ProductsIndex';
import { Settings } from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<ProductsIndex />} />
            <Route path="/products/:slug" element={<ProductPage />} />
            <Route path="/records" element={<AllRecords />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
