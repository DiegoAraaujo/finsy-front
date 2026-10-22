import { cn } from "@/lib/utils";
const PageHeaderBackground = () => {
  return (
    <div
      className={cn(
        "ambient-background pointer-events-none absolute [inset:0] -z-1 overflow-hidden [&_>_span]:absolute [&_>_span]:block [&_>_span]:rounded-full",
      )}
      aria-hidden="true"
    >
      <span
        className={cn(
          "ambient-orbit top-[105px] right-[-180px] h-102.5 w-102.5 border border-[#d7e2fa] bg-[#edf2fc] shadow-[0_0_0_38px_#e9effa80,_0_0_0_39px_#dfe8f8,_0_0_0_78px_#edf2fb70] max-[761px]:top-22.5 max-[761px]:right-[-185px] max-[761px]:h-72.5 max-[761px]:w-72.5 max-[761px]:shadow-[0_0_0_28px_#e9effa80,_0_0_0_29px_#dfe8f8]",
        )}
      />
      <span
        className={cn(
          "ambient-circle top-120 left-[-110px] h-57.5 w-57.5 border border-[#e0e9fb] bg-[#e8effb] max-[761px]:top-142.5 max-[761px]:left-[-120px] max-[761px]:h-45 max-[761px]:w-45",
        )}
      />
      <span
        className={cn(
          "ambient-small-circle top-12 left-[40%] h-32.5 w-32.5 border border-[#e4ebf9] max-[761px]:hidden!",
        )}
      />
    </div>
  );
};
export default PageHeaderBackground;
