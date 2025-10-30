import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ExperiencePage from './pages/ExperiencePage';
import CheckoutPage from './pages/CheckoutPage';
import ResultPage from './pages/ResultPage';

function App() {
  return (
    <div className="min-h-screen bg-sand-50 text-slate-900">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/experiences/:id" element={<ExperiencePage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </div>
  );
}

export default App;
