import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './layout/AppLayout'
import DashboardPage from './pages/DashboardPage'
import ExpensesPage from './pages/ExpensesPage'
import BudgetsPage from './pages/BudgetsPage'
import IncomePage from './pages/IncomePage'
import CategoriesPage from './pages/CategoriesPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="expenses" element={<ExpensesPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="budgets" element={<BudgetsPage />} />
          <Route path="income" element={<IncomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App