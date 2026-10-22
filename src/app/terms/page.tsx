import type { Metadata } from "next";
import Link from "next/link";
import LegalDocument from "@/components/LegalDocument";

export const metadata: Metadata = {title: "Termos de Uso"};
export const dynamic = "force-dynamic";
export default function Page() {
  return <LegalDocument title="Termos de Uso">
    <h2>1. O serviço</h2>
    <p>O Finsy é uma ferramenta de organização financeira pessoal: permite registrar receitas e despesas, organizar categorias e limites, acompanhar cartões, parcelas, recorrências, vencimentos e lembretes de gastos planejados, além de importar arquivos compatíveis. Os recursos disponíveis podem variar durante a fase de testes.</p>
    <p>O Finsy não movimenta dinheiro, não mantém contas bancárias e não oferece crédito ou consultoria de investimentos. Valores, saldos e faturas apresentados dependem dos registros e configurações informados por você e podem divergir dos dados do seu banco. Confira as informações antes de tomar decisões ou pagar contas.</p>
    <h2>2. Cadastro e acesso</h2>
    <p>O serviço é destinado a pessoas com 18 anos ou mais. Informe dados verdadeiros, utilize um e-mail ao qual tenha acesso e proteja sua senha. Não compartilhe credenciais ou use a conta de terceiros. Avise o suporte se identificar acesso indevido; você pode encerrar outras sessões em Configurações.</p>
    <p>Ao marcar a opção de aceite no cadastro, você concorda com esta versão dos Termos de Uso. A versão e a data do aceite são registradas. Contas anteriores à adoção destes termos não recebem um aceite retroativo: o aplicativo oferece a opção de registrá-lo em Configurações.</p>
    <h2>3. Registros, importações e lembretes</h2>
    <p>Você decide quais dados inserir. Confira datas, valores, sinais, categorias, parcelas e possíveis duplicidades antes de confirmar uma importação. Não informe senhas bancárias, números completos de cartão, códigos de segurança ou dados de terceiros desnecessários nas descrições e arquivos.</p>
    <p>Uma compra no crédito, seu vencimento e o pagamento da fatura representam etapas diferentes. Recorrências podem gerar registros conforme a configuração escolhida. Gastos planejados funcionam como lembretes e só se tornam movimentações quando registrados por você. Avisos dentro do aplicativo não substituem a conferência das obrigações financeiras e não garantem notificações por e-mail ou celular.</p>
    <h2>4. Uso permitido</h2>
    <p>Utilize o Finsy para finalidades lícitas. É proibido tentar acessar dados de outra pessoa, explorar vulnerabilidades, distribuir conteúdo malicioso ou comprometer o funcionamento do serviço. Podemos limitar ou suspender acessos em caso de abuso, risco à segurança ou determinação legal, com comunicação quando possível e sem prejudicar direitos assegurados por lei.</p>
    <h2>5. Disponibilidade e mudanças</h2>
    <p>Durante testes, podem ocorrer falhas e interrupções. Trabalharemos para corrigir problemas reportados e proteger os dados, mas não prometemos funcionamento ininterrupto ou ausência de erros. Recomendamos exportar periodicamente seus registros. Essas condições não afastam responsabilidades ou direitos previstos na legislação aplicável.</p>
    <p>Podemos corrigir, adicionar ou reorganizar recursos. Mudanças relevantes nos termos serão comunicadas pelo aplicativo ou por e-mail, com indicação da nova versão e oportunidade de conhecer as alterações. Não presumiremos um aceite retroativo para novas condições contratuais.</p>
    <h2>6. Gratuidade e eventual cobrança</h2>
    <p>Esta versão é disponibilizada sem cobrança de assinatura pelo Finsy. Uma oferta paga futura deverá informar preço, recursos, periodicidade, renovação, cancelamento e demais condições antes da contratação. A existência de uma conta gratuita não autoriza cobrança automática.</p>
    <h2>7. Seus dados e encerramento</h2>
    <p>Você pode corrigir seus dados de perfil, exportar seus registros e solicitar a exclusão da conta em Configurações. A exclusão exige sua senha e confirmação expressa e encerra o acesso à conta. Consulte a <Link href="/privacy" className="text-primary underline">Política de Privacidade</Link> para entender retenção, cópias de segurança, fornecedores e direitos. O aceite destes termos não representa autorização genérica para qualquer uso dos seus dados.</p>
    <h2>8. Legislação e atendimento</h2>
    <p>Aplicam-se as leis brasileiras, inclusive a LGPD e, quando houver relação de consumo, as normas de proteção do consumidor. Nenhuma cláusula retira direitos obrigatórios ou impõe foro que impeça seu acesso à Justiça. Dúvidas e solicitações podem ser encaminhadas ao contato informado no início desta página.</p>
  </LegalDocument>;
}
