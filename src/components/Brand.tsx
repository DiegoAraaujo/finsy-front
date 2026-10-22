import { cn } from "@/lib/utils";
import logo from "../assets/finsy_logo.svg";
export default function Brand() {
  return (
    <img
      className={cn("finance-logo h-[55px] w-40 object-contain")}
      src={typeof logo === "string" ? logo : logo.src}
      alt="Finsy"
    />
  );
}
