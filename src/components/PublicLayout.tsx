"use client";
import { cn } from "@/lib/utils";

import Brand from "./Brand";
import LegalLinks from "./LegalLinks";
import PageHeaderBackground from "./PageHeaderBackground";
import { type ReactNode } from "react";
import { useUser } from "../hooks/user/useUser";
import Loading from "./Loading";
const PublicLayout = ({ children }: { children: ReactNode }) => {
  const { isRestoring } = useUser();
  if (isRestoring) return <Loading fullScreen label="Abrindo seu espaço…" />;
  return (
    <main
      className={cn(
        "auth-layout relative isolate grid min-h-dvh grid-cols-[1fr_1.1fr] max-[761px]:grid-cols-[1fr] [&_.ambient-circle]:top-auto [&_.ambient-circle]:bottom-[-100px] [&_.ambient-circle]:left-[-80px] [&_.ambient-circle]:h-85 [&_.ambient-circle]:w-85 [&_.ambient-orbit]:top-[-100px] [&_.ambient-orbit]:right-[40%] max-[761px]:[&_.ambient-orbit]:top-[-90px] max-[761px]:[&_.ambient-orbit]:right-[-130px]",
      )}
    >
      <PageHeaderBackground />
      <aside
        className={cn(
          "auth-story flex flex-col bg-[#e8effbbf] px-[55px] py-[45px] max-[761px]:hidden [&_h1]:text-[length:clamp(32px,_3.5vw,_53px)] [&_h1]:leading-[1.25] [&_h1]:font-[550] [&_h1]:tracking-[-2px] [&_h1]:text-[#194bd1]",
        )}
      >
        <div
          className={cn(
            "finance-brand text-primary flex w-fit items-center gap-2.5 text-[length:37px] font-[750] tracking-[-2px]",
          )}
        >
          <Brand />
        </div>
        <div
          className={cn(
            "auth-story-content mx-0 my-auto px-0 py-[65px] [&_>_p]:mt-5.5 [&_>_p]:max-w-87.5 [&_>_p]:text-[length:14px] [&_>_p]:leading-[1.9] [&_>_p]:text-[#6b7589]",
          )}
        >
          <span
            className={cn(
              "eyebrow mb-2.5 block text-[length:11px] font-[650] tracking-[1.6px] text-[#727c91]",
            )}
          >
            UM PASSO DE CADA VEZ
          </span>
          <h1>
            Mais clareza.
            <br />
            Mais tranquilidade.
          </h1>
          <p>
            Um espaço simples para entender seus gastos e fazer planos que
            combinam com a sua vida.
          </p>
          <div
            className={cn(
              "auth-illustration mt-[45px] flex items-center gap-[15px] [&_>_span]:grid [&_>_span]:h-27.5 [&_>_span]:w-20 [&_>_span]:[transform:rotate(-15deg)] [&_>_span]:place-items-center [&_>_span]:rounded-[45px] [&_>_span]:border [&_>_span]:border-[#cad1df] [&_>_span]:bg-[#e8ecf4] [&_>_span]:text-[length:30px] [&_>_span]:text-[#657390] [&_>_span:nth-child(2)]:h-35 [&_>_span:nth-child(2)]:w-25 [&_>_span:nth-child(2)]:[transform:rotate(10deg)] [&_>_span:nth-child(2)]:bg-[#194bd1] [&_>_span:nth-child(2)]:text-[length:56px] [&_>_span:nth-child(2)]:text-[#c7d1e6] [&_>_span:nth-child(3)]:[transform:rotate(22deg)] [&_>_span:nth-child(3)]:bg-[#dfd5b8] [&_>_span:nth-child(3)]:text-[#8a7751]",
            )}
            aria-hidden="true"
          >
            <span>
              <i className="bi bi-arrow-down-up" />
            </span>
            <span>
              <i className="bi bi-graph-up-arrow" />
            </span>
            <span>
              <i className="bi bi-bar-chart-line" />
            </span>
          </div>
        </div>
        <p
          className={cn("auth-story-footer text-[length:11px] text-[#7f899d]")}
        >
          Sua vida financeira, do seu jeito.
        </p>
      </aside>
      <div
        className={cn(
          "auth-content flex flex-col items-center justify-center bg-[#fbfcfff0] px-[45px] py-[55px] max-[761px]:pt-7.5 max-[761px]:pr-[25px] max-[761px]:pb-10 max-[761px]:pl-[25px] [&_.auth-mobile-brand]:hidden max-[761px]:[&_.auth-mobile-brand]:mb-[35px] max-[761px]:[&_.auth-mobile-brand]:flex max-[761px]:[&_.auth-mobile-brand]:self-center max-[761px]:[&_.auth-mobile-brand]:text-[length:31px] [&_>_section]:max-w-97.5 max-[761px]:[&_>_section]:my-auto max-[761px]:[&_.auth-form-heading]:text-center",
        )}
      >
        <div
          className={cn(
            "auth-mobile-brand finance-brand text-primary flex w-fit items-center gap-2.5 text-[length:37px] font-[750] tracking-[-2px] max-[761px]:[&_.brand-symbol]:h-[35px] max-[761px]:[&_.brand-symbol]:w-[35px] max-[761px]:[&_.brand-symbol]:text-[length:25px]",
          )}
        >
          <Brand />
        </div>
        <>{children}</>
        <div className="mt-8"><LegalLinks /></div>
      </div>
    </main>
  );
};
export default PublicLayout;
