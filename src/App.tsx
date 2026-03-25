import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import Home from "./pages/home";
import BudgetPlanningPage from "./pages/budgetPlanningPage";
import Historic from "./pages/historic";
import CategoryExpenses from "./pages/CategoryExpenses";
import Login from "./pages/login";
import { UserContextProvider } from "./contexts/UserContext";
import AppGate from "./pages/appGate";
import CreateMonth from "./pages/createMonth";
import MonthGate from "./pages/monthGate";

import FlowLayout from "./components/FlowLayout";
import AppLayout from "./components/AppLayout";
import PublicLayout from "./components/PublicLayout";
import ProtectedLayout from "./components/ProtectedLayout";

const App = () => {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <Toaster richColors position="top-right" closeButton duration={3000} />

        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>

          <Route element={<ProtectedLayout />}>
            <Route element={<FlowLayout />}>
              <Route path="/" element={<AppGate />} />
              <Route path="/create-month" element={<CreateMonth />} />
              <Route path="/month-gate" element={<MonthGate />} />
            </Route>

            <Route element={<AppLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/historic" element={<Historic />} />
              <Route path="/budget-planning" element={<BudgetPlanningPage />} />
              <Route path="/category/:id" element={<CategoryExpenses />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
  );
};

export default App;
