import { useState } from "react";

import Header from "./Header";


const BudgetPlanningPage = () => {
  const [salary, setSalary] = useState<number>(40);
  return (
    <>
      <div className="relative h-32">
        <Header title="Editar orçamento" />
      </div>

      <div className="mt-2 flex flex-row flex-wrap gap-2 px-4">
        <label htmlFor="salary" className="font-semibold text-gray-500">
          Salário Mensal
        </label>
        <div className="flex gap-4 rounded-lg border border-gray-300 px-4 py-1">
          <p className="text-gray-500">R$</p>
          <input
            onChange={(e) => setSalary(Number(e.target.value))}
            type="text"
            id="salary"
            value={salary}
            className="flex-1 focus:outline-0"
          />
        </div>
      </div>
    </>
  );
};

export default BudgetPlanningPage;
