import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useCurrentMonth } from "../../hooks/month/useCurrentMonth";
import { useLatestMonth } from "../../hooks/month/useLatestMonth";

import FinsyLogo from "../../assets/finsy_logo.png";

const AppGate = () => {
  const navigate = useNavigate();

  const {
    data: currentData,
    isLoading: loadingCurrent,
    error: errorCurrent,
  } = useCurrentMonth();

  const {
    data: latestData,
    isLoading: loadingLatest,
    error: errorLatest,
  } = useLatestMonth();

  useEffect(() => {
    if (errorCurrent || errorLatest) {
      toast.error("Erro ao carregar dados");
      return;
    }

    if (loadingCurrent || loadingLatest) return;

    if (currentData) {
      navigate("/home");
      return;
    }

    if (latestData) {
      navigate("/month-gate");
      return;
    }

    navigate("/create-month");
  }, [
    currentData,
    latestData,
    loadingCurrent,
    loadingLatest,
    errorCurrent,
    errorLatest,
    navigate,
  ]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <img src={FinsyLogo} alt="Finsy logo" className="w-32" />
      <p className="text-secundary">Organize seus gastos Facilmente</p>

      <div className="mt-4 flex gap-2">
        <span className="dot bg-primary"></span>
        <span className="dot bg-primary delay-1"></span>
        <span className="dot bg-primary delay-2"></span>
      </div>
    </div>
  );
};

export default AppGate;
