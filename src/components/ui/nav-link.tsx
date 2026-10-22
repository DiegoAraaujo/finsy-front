"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
type Props = Omit<ComponentProps<typeof Link>, "className"> & {
  className?: string | ((state: { isActive: boolean }) => string);
};
export default function NavLink({ className, href, ...props }: Props) {
  const pathname = usePathname();
  const target = typeof href === "string" ? href : (href.pathname ?? "/");
  const isActive =
    pathname === target ||
    (target !== "/" && pathname.startsWith(`${target}/`));
  return (
    <Link
      {...props}
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={
        typeof className === "function" ? className({ isActive }) : className
      }
    />
  );
}
