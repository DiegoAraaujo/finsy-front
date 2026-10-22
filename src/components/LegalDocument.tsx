import Link from "next/link";
import type { ReactNode } from "react";
import LegalLinks from "./LegalLinks";
import { TERMS_VERSION } from "@/lib/legal";

export function LegalIdentity() {
  const name = process.env.LEGAL_CONTROLLER_NAME?.trim();
  const email = process.env.PRIVACY_EMAIL?.trim();
  return <section aria-label="Responsável e contato" className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
    <h2>Responsável e contato</h2>
    <p>O Finsy é oferecido por {name || "responsável ainda não identificado nesta versão de testes"}, na qualidade de controlador dos dados pessoais. O responsável pode ser pessoa física ou pessoa jurídica.</p>
    {email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? <p>Para suporte e pedidos de privacidade: <a href={`mailto:${email}`} className="text-primary underline">{email}</a>.</p>
      : <p role="note">O e-mail público de privacidade ainda não foi configurado. Esta minuta precisa dessa informação antes da abertura do serviço ao público.</p>}
  </section>;
}

export default function LegalDocument({title, children}: {title:string; children:ReactNode}) {
  return <main className="relative min-h-dvh overflow-hidden px-4 py-8 sm:px-8 sm:py-12">
    <div aria-hidden="true" className="pointer-events-none absolute -right-28 -top-36 h-96 w-96 rounded-full border-[55px] border-blue-100/60" />
    <article className="relative mx-auto max-w-3xl rounded-3xl border border-[#e0e6f1] bg-white p-6 shadow-sm sm:p-12 [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_p]:my-3 [&_p]:text-sm [&_p]:leading-7 [&_p]:text-[#55627a] [&_li]:my-2 [&_li]:text-sm [&_li]:leading-7 [&_li]:text-[#55627a] [&_ul]:list-disc [&_ul]:pl-5">
      <Link href="/login" className="text-3xl font-extrabold tracking-tight text-primary">FINSY</Link>
      <h1 className="mb-3 mt-8 text-3xl font-semibold tracking-tight">{title}</h1>
      <p>Versão {TERMS_VERSION} · Atualizado em 22 de outubro de 2026.</p>
      <LegalIdentity />
      {children}
      <footer className="mt-10 flex flex-col gap-6 border-t border-[#e0e6f1] pt-6">
        <LegalLinks />
        <div className="flex flex-wrap justify-center gap-5 text-sm text-primary">
          <Link href="/login">Ir para o login</Link><Link href="/settings">Voltar para minha conta</Link>
        </div>
      </footer>
    </article>
  </main>;
}
