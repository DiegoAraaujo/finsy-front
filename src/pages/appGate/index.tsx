import { useEffect } from "react";
import FinsyLogo from "../../assets/finsy_logo.png";
import { getCurrentMonth, getLastestMonth } from "../../services/monthService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const AppGate = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { month: latestMonth } = await getLastestMonth();
        const { month: currentMonth } = await getCurrentMonth();

        if (currentMonth) {
          return navigate("/home");
        }

        if (latestMonth) {
          navigate("/");
        } else {
          navigate("/");
        }
      } catch (error) {
        if (error instanceof Error) toast.error(error.message);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <img src={FinsyLogo} alt="Finsy logo" className="w-32" />
      <p className="text-gray-500">Organize seus gastos Facilmente</p>

      <div className="mt-4 flex gap-2">
        <span className="dot bg-blue-600"></span>
        <span className="dot bg-blue-600 delay-1"></span>
        <span className="dot bg-blue-600 delay-2"></span>
      </div>
    </div>
  );
};

export default AppGate;
