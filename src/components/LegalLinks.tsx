import Link from "next/link";

export default function LegalLinks() {
  return <nav aria-label="Informações legais" className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-[#657390]">
    <Link className="underline underline-offset-4 hover:text-primary" href="/terms">Termos de Uso</Link>
    <Link className="underline underline-offset-4 hover:text-primary" href="/privacy">Política de Privacidade</Link>
  </nav>;
}
