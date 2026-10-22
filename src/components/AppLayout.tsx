"use client";
import { cn } from "@/lib/utils";

import Brand from "./Brand";
import { DotsRing } from "@/components/ui/dots-ring";
import PageHeaderBackground from "./PageHeaderBackground";
import NavLink from "@/components/ui/nav-link";
import { type ReactNode } from "react";
import { useUser } from "../hooks/user/useUser";
import { useLogout } from "../hooks/user/useLogout";
const links = [
  { to: "/home", icon: "grid-1x2", label: "Visão do mês" },
  { to: "/transactions", icon: "arrow-down-up", label: "Movimentações" },
  { to: "/categories", icon: "collection", label: "Categorias e limites" },
  { to: "/planning", icon: "calendar2-week", label: "Planejamento" },
];
export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, setUser } = useUser();
  const { mutate: logout, isPending } = useLogout();
  return (
    <div
      className={cn(
        "finance-shell h-dvh overflow-hidden text-[length:14px] min-[761px]:[@media(500px<height<=850px)]:[&_.finance-sidebar]:pt-5 min-[761px]:[@media(500px<height<=850px)]:[&_.finance-sidebar]:pb-4 min-[761px]:[@media(height<=500px)]:[&_.finance-sidebar]:py-3",
      )}
    >
      <a
        className={cn(
          "skip-link text-primary fixed top-[-80px] left-[15px] z-100 rounded-lg bg-white p-3 [&:focus]:top-2.5",
        )}
        href="#main-content"
      >
        Ir para o conteúdo
      </a>
      <aside
        className={cn(
          "finance-sidebar fixed [inset:0_auto_0_0] z-30 flex h-dvh w-61.5 flex-col border-r border-r-[#e1e5ed] bg-white pt-[37px] pr-[23px] pb-5.5 pl-[23px] max-[1201px]:w-52.5 max-[1201px]:pt-7.5 max-[1201px]:pr-[17px] max-[1201px]:pb-5 max-[1201px]:pl-[17px] max-[1001px]:w-45 max-[1001px]:px-3 max-[761px]:hidden [&_nav]:flex [&_nav]:flex-col [&_nav]:gap-[9px] min-[761px]:[@media(height<=500px)]:[&_.finance-logo]:h-9.5 min-[761px]:[@media(height<=500px)]:[&_nav]:mt-2 min-[761px]:[@media(height<=500px)]:[&_nav]:gap-1",
        )}
      >
        <NavLink
          className={cn(
            "finance-brand text-primary flex w-fit items-center gap-2.5 text-[length:37px] font-[750] tracking-[-2px]",
          )}
          href="/home"
          aria-label="Finsy, início"
        >
          <Brand />
        </NavLink>
        <p
          className={cn(
            "sidebar-caption mt-3.5 mr-0 mb-10 ml-0 text-[length:10px] font-[650] tracking-[1.7px] text-[#7d8699] max-[1001px]:text-[length:7px] max-[1001px]:tracking-[1px] min-[761px]:[@media(500px<height<=850px)]:mt-2 min-[761px]:[@media(500px<height<=850px)]:mr-0 min-[761px]:[@media(500px<height<=850px)]:mb-5.5 min-[761px]:[@media(500px<height<=850px)]:ml-0 min-[761px]:[@media(height<=500px)]:mt-2 min-[761px]:[@media(height<=500px)]:mr-0 min-[761px]:[@media(height<=500px)]:mb-5.5 min-[761px]:[@media(height<=500px)]:ml-0 min-[761px]:[@media(height<=500px)]:hidden",
          )}
        >
          MENOS RUÍDO. MAIS CLAREZA.
        </p>
        <nav aria-label="Navegação principal">
          {links.map((link) => (
            <NavLink
              key={link.to}
              href={link.to}
              className={({ isActive }) =>
                cn(
                  `sidebar-link [&:hover]:text-primary [&.active]:text-primary flex items-center gap-3 rounded-[10px] px-[13px] py-3.5 font-[550] text-[#707a8f] [transition:background_0.15s,_color_0.15s] max-[1001px]:gap-[9px] max-[1001px]:px-2.5 max-[1001px]:text-[length:13px] [&_.nav-chevron]:ml-auto [&_.nav-chevron]:text-[length:12px] [&_.nav-chevron]:opacity-0 [&_>_.bi]:text-[length:17px] [&.active]:bg-[#e8ecf3] [&.active]:font-[650] [&.active_.nav-chevron]:opacity-100 [&:hover]:bg-[#f1f3f7] min-[761px]:[@media(500px<height<=850px)]:py-[11px] min-[761px]:[@media(height<=500px)]:py-2 ${isActive ? "active" : ""}`,
                )
              }
            >
              <i aria-hidden="true" className={`bi bi-${link.icon}`} />
              <span>{link.label}</span>
              <i
                aria-hidden="true"
                className="bi bi-chevron-right nav-chevron"
              />
            </NavLink>
          ))}
        </nav>
        <div
          className={cn(
            "sidebar-bottom mt-auto pt-10 min-[761px]:[@media(500px<height<=850px)]:shrink-0 min-[761px]:[@media(500px<height<=850px)]:pt-4.5 min-[761px]:[@media(height<=500px)]:shrink-0 min-[761px]:[@media(height<=500px)]:pt-2.5",
          )}
        >
          <div
            className={cn(
              "sidebar-note mb-7 rounded-xl border border-[#e3e7f0] bg-[#f1f3f8] px-[15px] py-[19px] [&_>_.bi]:text-[length:23px] [&_>_.bi]:text-[#596c92] [&_p]:mt-2 [&_p]:text-[length:12px] [&_p]:leading-[1.9] [&_p]:text-[#697285] [&_strong]:font-[550] min-[761px]:[@media(500px<height<=850px)]:mb-4 min-[761px]:[@media(500px<height<=850px)]:p-[13px] min-[761px]:[@media(500px<height<=850px)]:[&_p]:text-[length:11px] min-[761px]:[@media(500px<height<=850px)]:[&_p]:leading-[1.6] min-[761px]:[@media(height<=500px)]:mb-4 min-[761px]:[@media(height<=500px)]:p-[13px] min-[761px]:[@media(height<=500px)]:[&_p]:text-[length:11px] min-[761px]:[@media(height<=500px)]:[&_p]:leading-[1.6] min-[761px]:[@media(height<=720px)]:hidden",
            )}
          >
            <i aria-hidden="true" className="bi bi-brightness-high" />
            <p>
              Um pouco mais de controle.
              <br />
              <strong>Um pouco mais de tranquilidade.</strong>
            </p>
          </div>
          <NavLink
            href="/settings"
            className={cn(
              "sidebar-profile flex items-center gap-2.5 border-t border-t-[#e8ebf1] pt-5.5 [&_>_.bi]:ml-auto [&_>_.bi]:text-[#8992a3] [&_small]:mt-[3px] [&_small]:block [&_small]:text-[length:12px] [&_small]:text-[#8991a2] [&_strong]:block [&_strong]:max-w-32 [&_strong]:overflow-hidden [&_strong]:text-[length:13px] [&_strong]:text-ellipsis [&_strong]:whitespace-nowrap min-[761px]:[@media(500px<height<=850px)]:pt-3.5 min-[761px]:[@media(height<=500px)]:pt-2.5",
            )}
          >
            <span
              className={cn(
                "profile-avatar grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#ebdfca] font-bold text-[#75644a]",
              )}
            >
              {user?.name.charAt(0).toLocaleUpperCase("pt-BR")}
            </span>
            <span>
              <strong>{user?.name}</strong>
            </span>
            <i aria-hidden="true" className="bi bi-gear" />
          </NavLink>
          <button
            className={cn(
              "sidebar-logout mt-4.5 flex items-center gap-2 text-[length:12px] text-[#7a8396] min-[761px]:[@media(500px<height<=850px)]:mt-3 min-[761px]:[@media(height<=500px)]:mt-3",
            )}
            disabled={isPending}
            aria-busy={isPending}
            onClick={() =>
              logout(undefined, { onSuccess: () => setUser(null) })
            }
          >
            {isPending ? (
              <DotsRing decorative size={16} className="text-current" />
            ) : (
              <i aria-hidden="true" className="bi bi-box-arrow-right" />
            )}
            {isPending ? "Saindo…" : "Sair da conta"}
          </button>
        </div>
      </aside>
      <div
        className={cn(
          "finance-main-wrap relative isolate ml-61.5 flex h-full min-w-0 flex-col max-[1201px]:ml-52.5 max-[1001px]:ml-45 max-[761px]:ml-0",
        )}
      >
        <PageHeaderBackground />
        <main
          id="main-content"
          className={cn(
            "finance-main mx-auto my-0 min-h-0 w-full max-w-365 flex-1 overflow-y-auto [overscroll-behavior-y:contain] pt-[39px] pr-10.5 pb-[25px] pl-10.5 max-[1201px]:px-[25px] max-[1201px]:py-7.5 max-[761px]:pt-[25px] max-[761px]:pr-4.5 max-[761px]:pb-25 max-[761px]:pl-4.5 min-[1600px]:pt-12.5",
          )}
        >
          <>{children}</>
        </main>
      </div>
      <nav
        className={cn(
          "finance-mobile-nav max-[761px]:[&_a.active]:text-primary hidden max-[761px]:fixed max-[761px]:right-0 max-[761px]:bottom-0 max-[761px]:left-0 max-[761px]:z-30 max-[761px]:flex max-[761px]:justify-around max-[761px]:border-t max-[761px]:border-t-[#dce1ea] max-[761px]:bg-[#fffffff5] max-[761px]:pt-3 max-[761px]:pr-[5px] max-[761px]:pb-[max(12px,_env(safe-area-inset-bottom))] max-[761px]:pl-[5px] max-[761px]:[backdrop-filter:blur(12px)] max-[761px]:[&_.bi]:text-[length:18px] max-[761px]:[&_a]:flex max-[761px]:[&_a]:min-w-[55px] max-[761px]:[&_a]:flex-col max-[761px]:[&_a]:items-center max-[761px]:[&_a]:gap-[5px] max-[761px]:[&_a]:px-[5px] max-[761px]:[&_a]:py-0 max-[761px]:[&_a]:text-[length:10px] max-[761px]:[&_a]:text-[#8c94a4] max-[761px]:[&_a.active]:font-[650]",
        )}
        aria-label="Navegação principal no celular"
      >
        {links.map((link) => (
          <NavLink
            key={link.to}
            href={link.to}
            aria-label={link.to === "/categories" ? link.label : undefined}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <i aria-hidden="true" className={`bi bi-${link.icon}`} />
            <span>
              {link.label === "Movimentações"
                ? "Movimentos"
                : link.label === "Visão do mês"
                  ? "Resumo"
                  : link.to === "/categories"
                    ? "Categorias"
                    : link.to === "/planning"
                      ? "Planejar"
                      : link.label}
            </span>
          </NavLink>
        ))}
        <NavLink href="/settings">
          <i aria-hidden="true" className="bi bi-person-circle" />
          <span>Conta</span>
        </NavLink>
      </nav>
    </div>
  );
}
