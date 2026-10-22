"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { useUser } from "@/hooks/user/useUser";
import { TERMS_VERSION } from "@/lib/legal";
import LegalLinks from "@/components/LegalLinks";
import { DotsRing } from "@/components/ui/dots-ring";
import { userError } from "@/utils/userError";

export default function LegalSettings() {
  const {user} = useUser();
  const [checked, setChecked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const legal = useQuery({queryKey:["account",user?.id,"legal"], queryFn: async () =>
    (await api.get<{currentVersion:string; acceptedVersion:string|null; acceptedAt:string|null}>("/users/legal")).data});
  return <div className="mt-6 space-y-4 border-t border-[#e0e6f1] pt-5 text-sm leading-7 text-[#657390]">
    <h3 className="font-semibold text-[#303c57]">Privacidade e termos</h3>
    <LegalLinks />
    <p>Para corrigir seus dados, use o formulário de perfil. Para acessar seus registros ou encerrar o tratamento da conta, utilize a exportação e a exclusão acima. Outros pedidos de privacidade podem ser enviados pelo contato público da Política de Privacidade.</p>
    {legal.isPending && <DotsRing size={24} label="Carregando aceite dos termos" />}
    {legal.isError && <button onClick={() => void legal.refetch()} className="text-primary underline">Tentar consultar aceite novamente</button>}
    {legal.data?.acceptedVersion === TERMS_VERSION ? <p>Termos aceitos em {legal.data.acceptedAt ? new Date(legal.data.acceptedAt).toLocaleDateString("pt-BR") : "data não informada"} · Versão {legal.data.acceptedVersion}.</p> : legal.data && <form onSubmit={async e => {
      e.preventDefault(); if (!checked || busy) return;
      setBusy(true); setError("");
      try {await api.post("/users/legal", {termsVersion: TERMS_VERSION}); await legal.refetch();}
      catch (err) {setError(userError(err, "Não foi possível registrar o aceite. Tente novamente."));}
      finally {setBusy(false);}
    }} className="space-y-3">
      <p>Conheça os documentos do Finsy. Ainda não há aceite registrado para a versão atual dos termos.</p>
      <label className="flex items-start gap-3"><input type="checkbox" required checked={checked} onChange={e => setChecked(e.target.checked)} className="mt-1.5 h-4 w-4 shrink-0 accent-[#194bd1]" />Li e aceito os Termos de Uso, versão {TERMS_VERSION}.</label>
      <button disabled={!checked || busy} className="rounded-lg bg-primary px-4 py-2 font-semibold text-white disabled:opacity-50">{busy ? "Registrando…" : "Registrar aceite"}</button>
    </form>}
    {error && <p role="alert" className="text-[#b83b48]">{error}</p>}
    <p>O aceite é dos termos do serviço. Ele não autoriza publicidade nem substitui a base legal para tratar seus dados.</p>
  </div>;
}
