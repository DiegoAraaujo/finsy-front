import CategoryCard from "./CategoryCard";

const CategoriesSection = () => {
  const categoriesMock = [
    {
      id: 1,
      name: "Food",
      totalBudget: 8,
      spentAmount: 3.55,
    },
    {
      id: 2,
      name: "Transport",
      totalBudget: 20,
      spentAmount: 12.3,
    },
    {
      id: 3,
      name: "Entertainment",
      totalBudget: 15,
      spentAmount: 17.9,
    },
    {
      id: 4,
      name: "Shopping",
      totalBudget: 50,
      spentAmount: 22.75,
    },
  ];

  return (
    <div className="flex flex-col gap-4 z-10 p-4">
      <p className=" text-gray-500 font-bold text-sm">Categorias</p>

      <div className="flex flex-col gap-4">
        {categoriesMock.map((c) => {
          return (
            <CategoryCard
              key={c.id}
              name={c.name}
              spentAmount={c.spentAmount}
              totalBudget={c.totalBudget}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesSection;
