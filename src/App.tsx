import Home from "./pages/home";
import BudgetPlanningPage from "./pages/budgetPlanningPage";
import Onboarding from "./pages/onboarding";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Historic from "./pages/historic";
import CategoryExpenses from "./pages/CategoryExpenses";
import Container from "./components/Container";

const App = () => {
  return (
    <BrowserRouter>
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:id" element={<CategoryExpenses />} />
          <Route path="/historic" element={<Historic />} />
          <Route path="/budget-planning" element={<BudgetPlanningPage />} />
        </Routes>
      </Container>
      {/* <Onboarding /> */}
    </BrowserRouter>
  );
};

export default App;
