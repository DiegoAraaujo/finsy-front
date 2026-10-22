import type { Metadata } from "next";
import LegalDocument from "@/components/LegalDocument";

export const metadata: Metadata = {title: "Política de Privacidade"};
export const dynamic = "force-dynamic";
export default function Page() {
  const providers = process.env.LEGAL_SERVICE_PROVIDERS?.trim();
  const location = process.env.LEGAL_DATA_LOCATION?.trim();
  const backupDays = process.env.LEGAL_BACKUP_RETENTION_DAYS?.trim();
  return <LegalDocument title="Política de Privacidade">
    <h2>1. Quais dados tratamos</h2>
    <p>Tratamos nome, e-mail, senha protegida por hash, datas do cadastro e de atualização, preferências, versão e data do aceite dos termos. Para prestar o serviço, armazenamos os dados financeiros que você escolhe informar: valores, datas, descrições, categorias, limites, nomes e configurações de cartões, parcelas, recorrências e lembretes. Contas antigas também podem conter registros de salário e despesas do modelo anterior.</p>
    <p>Não solicitamos CPF, senha de banco, número completo ou código de segurança de cartão para utilizar os recursos atuais. Evite incluir esses dados ou informações de saúde, religião ou outras informações sensíveis nas descrições livres. Dados financeiros exigem cuidado, mesmo quando não pertencem à categoria legal de dados pessoais sensíveis.</p>
    <p>Ao importar um extrato, o texto do arquivo é enviado ao backend para leitura e preparação dos lançamentos. O fluxo atual não arquiva o arquivo original: conserva os registros que você confirma e identificadores utilizados para detectar duplicidades.</p>
    <h2>2. Finalidades e bases legais</h2>
    <ul>
      <li>Cadastro, autenticação, organização financeira, exportação e atendimento: execução do contrato ou de procedimentos solicitados por você (art. 7º, V, da LGPD).</li>
      <li>Prevenção de abuso, limites de tentativas, gestão de sessões e investigação de falhas: legítimo interesse, observado o equilíbrio com seus direitos (art. 7º, IX), e exercício regular de direitos quando aplicável (art. 7º, VI).</li>
      <li>Conservação ou fornecimento de informações exigidos por obrigação legal ou ordem válida: cumprimento de obrigação legal ou regulatória (art. 7º, II).</li>
    </ul>
    <p>Os dados necessários para criar e proteger sua conta são condição para oferecer o serviço. Os lançamentos financeiros são fornecidos por sua escolha. Não usamos o aceite dos termos como consentimento para publicidade ou para finalidades incompatíveis. Uma funcionalidade futura que dependa de consentimento deverá solicitá-lo de forma específica e permitir sua revogação.</p>
    <h2>3. Cookies e informações técnicas</h2>
    <p>Usamos o cookie essencial <strong>finsy_refreshToken</strong> para manter sua sessão por até sete dias. Ele é HttpOnly e, em produção, deve ser enviado somente por HTTPS. O token de acesso permanece em memória e expira em poucos minutos. O frontend não armazena credenciais ou lançamentos em localStorage ou sessionStorage.</p>
    <p>O servidor recebe seu IP para atender requisições e limitar tentativas. O limitador armazena identificadores derivados por hash de IP e e-mail, com expiração; esses identificadores são pseudonimizados, não necessariamente anônimos. Os logs do aplicativo registram rota, método, status e identificador da requisição, sem corpo dos formulários, parâmetros de consulta, senha, cookie ou token. A infraestrutura de hospedagem pode manter registros próprios, que precisam seguir a política operacional informada pelo responsável.</p>
    <p>Não identificamos cookies de publicidade, ferramentas de rastreamento comercial ou analytics de terceiros no código atual do aplicativo. Cookies essenciais não são usados para publicidade. Mudanças nessa prática serão informadas antes da ativação de novas ferramentas.</p>
    <h2>4. Compartilhamento e fornecedores</h2>
    <p>O serviço utiliza infraestrutura de hospedagem e banco de dados para funcionar. O envio de recuperação de senha, confirmação de e-mail e avisos de segurança utiliza o SMTP do Gmail/Google, que recebe o endereço do destinatário e o conteúdo necessário à mensagem. Links de segurança têm validade limitada e devem ser mantidos em sigilo.</p>
    <p>Fornecedores de hospedagem, banco e backup: {providers || "ainda pendentes de identificação para o ambiente de produção; esta informação deve ser completada antes da abertura pública"}.</p>
    <p>Localização do tratamento e eventual transferência internacional: {location || "ainda pendente de definição e documentação para o ambiente de produção"}. O uso de fornecedores no exterior exige avaliar as garantias e mecanismos legais aplicáveis às transferências internacionais. Esta política, sozinha, não formaliza essas garantias.</p>
    <p>Não há venda de dados ou compartilhamento publicitário implementados no Finsy. Podemos atender determinações legais válidas e utilizar acesso técnico restrito quando necessário ao suporte e à segurança.</p>
    <h2>5. Retenção e exclusão</h2>
    <p>Os dados da conta e registros financeiros permanecem enquanto a conta estiver ativa. Um lançamento removido da interface pode continuar marcado como excluído no banco; a exportação inclui esses registros com a indicação de exclusão. Excluir a conta remove os registros associados do banco principal, incluindo sessões e solicitações de troca de e-mail e senha.</p>
    <p>Sessões expiradas ou revogadas e solicitações de senha e troca de e-mail são eliminadas pela rotina de manutenção após o prazo técnico de até 24 horas contado da expiração ou revogação aplicável, acrescido do intervalo da execução. A fila de e-mails elimina o conteúdo após processamento e remove jobs vencidos ou concluídos conforme sua validade e rotina de limpeza. O limitador elimina identificadores expirados. Essas rotinas dependem da execução contínua do backend.</p>
    <p>Cópias de segurança não são apagadas individualmente a cada exclusão de conta. Prazo máximo configurado de retenção de backups: {backupDays && /^\d+$/.test(backupDays) ? `${backupDays} dias, conforme a política operacional a ser cumprida pelo responsável` : "ainda pendente de definição pelo responsável"}. Backups devem ter acesso restrito e, em uma restauração, exclusões posteriores à cópia precisam ser reaplicadas antes de reabrir o serviço. Retenção adicional só deve ocorrer com fundamento legal e acesso limitado.</p>
    <h2>6. Como exercer seus direitos</h2>
    <p>Em Configurações você pode corrigir nome e e-mail, baixar uma cópia dos dados e excluir a conta. A troca de e-mail exige confirmação no novo endereço. Para confirmação de tratamento, acesso detalhado, correção, informações sobre compartilhamento, oposição, revisão de eventual decisão automatizada, anonimização, bloqueio, eliminação ou portabilidade nos termos aplicáveis, use o contato público desta página.</p>
    <p>Podemos solicitar informações proporcionais para verificar sua identidade antes de entregar ou alterar dados. As solicitações serão analisadas gratuitamente, observando os prazos e exceções legais. Exportar um JSON facilita o acesso aos registros, mas não representa garantia de compatibilidade com outro serviço. Você também pode procurar a ANPD e os órgãos de defesa de direitos competentes.</p>
    <h2>7. Proteção, incidentes e público</h2>
    <p>Adotamos isolamento por conta, validações no servidor, hashes de senha, tokens de segurança com validade limitada, revogação de sessões e criptografia do conteúdo da fila de e-mails. Essas medidas reduzem riscos, mas não eliminam a possibilidade de incidentes. Incidentes serão avaliados e comunicados aos titulares e à ANPD quando exigido pela regulamentação aplicável.</p>
    <p>O serviço se destina a maiores de 18 anos. Se identificar uma conta de criança ou adolescente, entre em contato para avaliação e providências. No fluxo atual, o Finsy não oferece decisões automatizadas de crédito ou investimento.</p>
    <h2>8. Atualizações</h2>
    <p>Esta política descreve a versão atual do aplicativo. Alterações relevantes serão comunicadas no serviço ou por e-mail. A versão e a data estão no início da página. O documento não substitui as medidas práticas de proteção e atendimento aos seus direitos.</p>
  </LegalDocument>;
}
