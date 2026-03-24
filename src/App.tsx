import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import Home from "./pages/home";
import BudgetPlanningPage from "./pages/budgetPlanningPage";
import Historic from "./pages/historic";
import CategoryExpenses from "./pages/CategoryExpenses";
import Container from "./components/Container";
import Login from "./pages/login";
import { UserContextProvider } from "./contexts/UserContext";
import ProtectedLayout from "./components/ProtectedLayout";
import AppGate from "./pages/appGate";
import CreateMonth from "./pages/createMonth";
import MonthGate from "./pages/monthGate";

const App = () => {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <Toaster richColors position="top-right" closeButton duration={3000} />
        <Container>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedLayout>
                  <AppGate />
                </ProtectedLayout>
              }
            />
            <Route
              path="/create-month"
              element={
                <ProtectedLayout>
                  <CreateMonth />
                </ProtectedLayout>
              }
            />
            <Route
              path="/month-gate"
              element={
                <ProtectedLayout>
                  <MonthGate />
                </ProtectedLayout>
              }
            />
            <Route
              path="/home"
              element={
                <ProtectedLayout>
                  <Home />
                </ProtectedLayout>
              }
            />

            <Route
              path="/historic"
              element={
                <ProtectedLayout>
                  <Historic />
                </ProtectedLayout>
              }
            />
            <Route
              path="/budget-planning"
              element={
                <ProtectedLayout>
                  <BudgetPlanningPage />
                </ProtectedLayout>
              }
            />
            <Route
              path="/category/:id"
              element={
                <ProtectedLayout>
                  <CategoryExpenses />
                </ProtectedLayout>
              }
            />
          </Routes>
        </Container>
      </BrowserRouter>
    </UserContextProvider>
  );
};

export default App;
