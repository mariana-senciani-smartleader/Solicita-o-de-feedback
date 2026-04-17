import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import {
  CheckCircle2, ChevronDown, Globe,
  Info, Paperclip, Search,
  Settings, Smile, Image as ImageIcon, X, UserPlus,
} from "lucide-react";
import {
  App, Avatar, Flex, Input, Popover, Segmented, Tooltip, Typography,
} from "antd";
import PostCard from "./PostCard";
import ChannelMembersModal from "./ChannelMembersModal";
import ChannelsSidebar from "./ChannelsSidebar";
import PendenciasWidget from "./PendenciasWidget";
import PesquisaCard from "./PesquisaCard";
import PendenciasTab from "./PendenciasTab";
import PendenciasModal from "./PendenciasModal";
import CreatePostModal, { type ScheduledPost } from "./CreatePostModal";
import ChannelSettingsModal from "./ChannelSettingsModal";
import EmojiPicker from "./EmojiPicker";

export interface ChannelInfo {
  label: string;
  icon: React.ElementType;
  iconBg: string;
}

const POST_TEXT = `Você Conseguiu! @Alana Rhye É uma excelente notícia saber que o seu salário está aumentando. Isso mostra o reconhecimento pelo seu trabalho duro e dedicação. Espero que este aumento de salário lhe traga mais tranquilidade financeira e possibilite realizar mais dos seus sonhos e objetivos. Continue trabalhando duro e tenha sucesso!`;

type PostType = {
  id: string; author: string; avatar: string; time: string; isNew: boolean;
  content: string; likes: number; comments: number; shares: number; type: any; media?: any; linkMeta?: any;
};

function seedFromId(id: string, salt: string): number {
  let h = 0;
  const s = id + salt;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Pontuação para ordenação “maior engajamento” (curtidas + comentários + compartilhamentos ponderados) */
function postEngagementScore(p: Pick<PostType, "likes" | "comments" | "shares">): number {
  return p.likes + p.comments * 2 + p.shares * 3;
}

const AVATARS: Record<string, string> = {
  "Bruno Delorence":  "/assets/avatar-bruno-delorence.png",
  "Ana Costa":        "/assets/avatar-ana-costa.png",
  "Carlos Mendes":    "/assets/avatar-carlos-mendes.png",
  "Fernanda Lima":    "/assets/avatar-fernanda-lima.png",
  "Rafael Souza":     "/assets/avatar-rafael-souza.png",
  "Juliana Rocha":    "/assets/avatar-juliana-rocha.png",
  "Pedro Alves":      "/assets/avatar-pedro-alves.png",
  "Camila Torres":    "/assets/avatar-camila-torres.png",
  "Diego Ferreira":   "/assets/avatar-diego-ferreira.png",
  "Mariana Oliveira": "/assets/avatar-mariana-oliveira.png",
};

const POST_AUTHORS = ["Bruno Delorence","Ana Costa","Carlos Mendes","Fernanda Lima","Rafael Souza","Juliana Rocha","Pedro Alves","Camila Torres","Diego Ferreira","Mariana Oliveira"] as const;

let _postIdx = 0;
const makePost = (id: string, content: string, type: any = "text", extra?: Partial<PostType>): PostType => {
  const author = POST_AUTHORS[_postIdx % POST_AUTHORS.length];
  _postIdx++;
  const likes = 14 + (seedFromId(id, "L") % 125);
  const comments = 1 + (seedFromId(id, "C") % 21);
  const shares = 1 + (seedFromId(id, "S") % 13);
  return {
    id, author, avatar: AVATARS[author],
    time: `${id} hora${id === "1" ? "" : "s"} atrás`, isNew: Number(id.replace(/\D/g,"")) <= 2,
    content,
    likes: extra?.likes ?? likes,
    comments: extra?.comments ?? comments,
    shares: extra?.shares ?? shares,
    type, ...extra,
  };
};

const initialChannelPosts: Record<string, PostType[]> = {
  "Geral": [
    makePost("1", POST_TEXT, "text"),
    makePost("2", "Nosso novo escritório finalmente ficou pronto! Confira como ficou o espaço de convivência. O time de facilities fez um trabalho incrível trazendo o conceito de biofilia para o ambiente. Feedback é bem-vindo!", "photo", { media: { images: ["/assets/post-corporate-meeting.png"] } }),
    makePost("3", "Registros do nosso workshop de inovação que rolou ontem. Foram mais de 40 participantes e 12 ideias priorizadas para o próximo trimestre. Obrigado a todos que contribuíram!", "2photos", { media: { images: ["/assets/post-dev-office.png", "/assets/post-workspace-flatlay.png"] } }),
    makePost("4", "Retrospectiva do evento Global Innovate Solutions 2026! Foi uma experiência incrível representar a empresa. Trouxemos muitos insights sobre IA aplicada, cultura organizacional e futuro do trabalho. Álbum completo abaixo.", "gallery", { media: { images: ["/assets/post-corporate-meeting.png", "/assets/post-dev-office.png", "/assets/post-celebration.png", "/assets/post-workspace-flatlay.png"] } }),
    makePost("5", "Gravamos o highlight do nosso all-hands de Q1! Foram apresentados os resultados do trimestre, reconhecimentos e os objetivos estratégicos para Q2. Quem não pôde participar ao vivo, vale a pena assistir.", "video", { media: { videoCover: "/assets/post-celebration.png", videoDuration: "12:30" } }),
    makePost("6", "Acabei de gravar um áudio rápido com um resumo das mudanças no processo de onboarding que entram em vigor na próxima semana. Ouçam e compartilhem com o time!", "audio", { media: { audioTitle: "Jotaerre Audio", audioDuration: "08:45" } }),
    makePost("7", "Novo episódio do nosso podcast corporativo no ar! Nessa edição, conversamos com a diretora de People sobre cultura remota, saúde mental e os desafios de escalar o time em 2026.", "audio_banner", { isNew: false, media: { images: ["/assets/post-dev-office.png"], audioTitle: "Podcast Corporativo – Ep. 12", audioDuration: "08:45" } }),
    makePost("8", "Confira este artigo incrível sobre inovação e transformação digital nas empresas modernas.", "link", { isNew: false, linkMeta: { title: "Como a transformação digital está redefinindo o futuro do trabalho", domain: "hbr.org", image: "/assets/post-workspace-flatlay.png", url: "#" } }),
  ],
  "Aniversariantes": [
    makePost("a1", "🎂 Hoje é aniversário da @Maria Silva! Ela completa 28 anos hoje. Deixe uma mensagem de parabéns para ela e mostre o quanto ela é especial para o time!", "photo", { isNew: true, media: { images: ["/assets/post-celebration.png"] } }),
    makePost("a2", "🎉 @João Costa completou mais um ano hoje! João faz parte do time de Desenvolvimento há 3 anos e é peça fundamental nos nossos projetos. Parabéns, João!", "text", { isNew: true }),
    makePost("a3", "🥳 Parabéns à @Carla Mendes do time de Marketing! Hoje ela celebra mais um ano de muitas conquistas e realizações. Que venham muitas mais!", "text", { isNew: false }),
  ],
  "Customer Success": [
    makePost("cs1", "Novo NPS recebido! O cliente da conta Enterprise avaliou nosso suporte com nota 10. Um trabalho incrível do time! Continuem assim. 🌟", "text", { isNew: true }),
    makePost("cs2", "Atualização: reduzimos o tempo médio de resposta para menos de 2 horas nesta semana. Meta batida! Próximo objetivo: 1h30. Vamos juntos! 💪", "text", { isNew: true }),
    makePost("cs3", "Relatório semanal de satisfação disponível. Taxa de retenção subiu para 94% — o maior índice dos últimos 6 meses. Excelente trabalho a todos.", "photo", { isNew: false, media: { images: ["/assets/post-workspace-flatlay.png"] } }),
  ],
  "Desenvolvimento": [
    makePost("dev1", "🚀 Deploy realizado com sucesso! Versão 2.4.1 está no ar com melhorias de performance e correção de bugs críticos. Changelog completo na documentação.", "text", { isNew: true }),
    makePost("dev2", "Code review pendente no PR #347 — Refatoração do módulo de autenticação. Precisamos de pelo menos 2 aprovações antes de mesclar. Alguém disponível?", "text", { isNew: true }),
    makePost("dev3", "Novo padrão de arquitetura para microsserviços foi aprovado pelo time. Apresentação completa disponível abaixo.", "link", { isNew: false, linkMeta: { title: "Arquitetura de Microsserviços — Guia Interno v2.0", domain: "notion.so", image: "/assets/post-dev-office.png", url: "#" } }),
  ],
  "Financeiro": [
    makePost("fin1", "📊 Fechamento do mês disponível. Resultado operacional acima da meta em 8%. Ótimo desempenho de toda a equipe! Detalhes no relatório anexo.", "text", { isNew: true }),
    makePost("fin2", "Lembrete: prazo para envio de notas fiscais é amanhã às 18h. Por favor, regularizem o quanto antes para evitar atrasos no processamento.", "text", { isNew: true }),
    makePost("fin3", "Apresentação do orçamento 2026 será na próxima quinta-feira às 14h. Sala de reuniões virtual — link será enviado por e-mail.", "text", { isNew: false }),
  ],
  "Jurídico": [
    makePost("jur1", "Atualização importante sobre a LGPD: novos procedimentos de tratamento de dados pessoais entram em vigor na próxima semana. Treinamento obrigatório para todos os colaboradores.", "text", { isNew: true }),
    makePost("jur2", "Contrato com fornecedor XYZ foi revisado e aprovado. Assinatura digital disponível no portal. Prazo para conclusão: 48 horas.", "text", { isNew: true }),
    makePost("jur3", "Novo modelo de NDA disponível para consulta. Utilizem sempre a versão 3.2 para novos acordos. O modelo anterior está descontinuado.", "link", { isNew: false, linkMeta: { title: "Modelo de NDA — Versão 3.2 (Atualizado)", domain: "drive.google.com", image: "/assets/post-workspace-flatlay.png", url: "#" } }),
  ],
  "Marketing": [
    makePost("mkt1", "🎯 Campanha de Abril já está no ar! Alcance das primeiras 24h superou a meta em 40%. Excelente trabalho do time criativo!", "photo", { isNew: true, media: { images: ["/assets/post-corporate-meeting.png"] } }),
    makePost("mkt2", "Resultados do A/B test do e-mail marketing: versão B teve 23% mais cliques. Vamos padronizar o novo layout para todas as campanhas daqui em diante.", "text", { isNew: true }),
    makePost("mkt3", "Briefing da campanha de Maio está disponível para revisão. Precisamos de aprovação do time até sexta-feira para não comprometer o cronograma.", "text", { isNew: false }),
  ],
  "Comercial": [
    makePost("com1", "🚀 Meta de vendas de Q1 batida com 112% de atingimento! Time comercial arrasou. Parabéns a todos os envolvidos. Vamos para Q2 com ainda mais força!", "text", { isNew: true }),
    makePost("com2", "Novo processo de qualificação de leads aprovado. A partir de segunda-feira o funil segue o novo fluxo. Detalhes no documento compartilhado.", "link", { isNew: true, linkMeta: { title: "Novo Processo de Qualificação de Leads — v2.0", domain: "notion.so", image: "/assets/post-corporate-meeting.png", url: "#" } }),
    makePost("com3", "Reunião de pipeline toda segunda às 9h. Confirme presença no calendário. Lembrem de atualizar o CRM antes da reunião.", "text", { isNew: false }),
  ],
  "Data & BI": [
    makePost("bi1", "📊 Dashboard de Q1 atualizado com os números finais. Acesso disponível para todos os gestores. Destaque para crescimento de 18% no MRR.", "photo", { isNew: true, media: { images: ["/assets/post-workspace-flatlay.png"] } }),
    makePost("bi2", "Novo relatório de churn disponível. Identificamos 3 clusters de risco alto. Reunião para discutir plano de ação na quinta às 14h.", "text", { isNew: true }),
    makePost("bi3", "Pipeline de dados migrado para o novo ambiente. Latência reduziu 40%. Monitoramento rodando 24/7. Alertas configurados no Slack.", "text", { isNew: false }),
  ],
  "Tecnologia": [
    makePost("tec1", "🔒 Patch de segurança aplicado em todos os servidores de produção. Zero downtime durante o processo. Excelente trabalho do time de infra!", "text", { isNew: true }),
    makePost("tec2", "Migração para Kubernetes concluída na fase 2. Próxima fase: migração dos serviços legados. Cronograma detalhado no Confluence.", "text", { isNew: true }),
    makePost("tec3", "Revisão de acessos e permissões concluída. Relatório de compliance enviado para a área de Segurança da Informação.", "text", { isNew: false }),
  ],
  "Comunicação": [
    makePost("com_1", "📢 Newsletter interna de Abril publicada! Confira as novidades do mês, conquistas do time e os próximos eventos da empresa.", "link", { isNew: true, linkMeta: { title: "Newsletter Interna – Abril 2026", domain: "mailchimp.com", image: "/assets/post-corporate-meeting.png", url: "#" } }),
    makePost("com_2", "Pesquisa de clima organizacional aberta até sexta! Sua participação é anônima e muito importante. Link no e-mail corporativo.", "text", { isNew: true }),
    makePost("com_3", "Novo guia de comunicação interna disponível. Padronização de canais, horários e formatos de mensagem para toda a empresa.", "text", { isNew: false }),
  ],
  "Operações": [
    makePost("ops1", "✅ SLA de atendimento interno reduzido de 48h para 24h a partir de hoje. Novos processos mapeados e treinamento concluído para toda a equipe.", "text", { isNew: true }),
    makePost("ops2", "Auditoria de processos Q1 finalizada. 12 pontos de melhoria identificados, 8 já em implementação. Relatório completo disponível.", "photo", { isNew: true, media: { images: ["/assets/post-dev-office.png"] } }),
    makePost("ops3", "Atualização do manual de procedimentos operacionais publicada. Versão 4.1 substitui a anterior. Por favor, façam o download.", "text", { isNew: false }),
  ],
  "Produtos": [
    makePost("prd1", "🎉 Feature de notificações em tempo real lançada em produção! Após 3 sprints de desenvolvimento, chegamos lá. Feedback dos usuários sendo coletado.", "text", { isNew: true }),
    makePost("prd2", "Roadmap de Q2 revisado e aprovado pela liderança. Prioridades: melhorias de performance, novo módulo de relatórios e onboarding redesenhado.", "link", { isNew: true, linkMeta: { title: "Roadmap de Produto — Q2 2026", domain: "figma.com", image: "/assets/post-workspace-flatlay.png", url: "#" } }),
    makePost("prd3", "Discovery da nova funcionalidade de integrações iniciado. Quem quiser participar das entrevistas com usuários, fale com o PM.", "text", { isNew: false }),
  ],
  "RH": [
    makePost("rh1", "📋 Processo seletivo para 5 novas vagas aberto! Vagas para Desenvolvimento, Marketing, CS e Produto. Indiquem talentos pelo portal interno.", "text", { isNew: true }),
    makePost("rh2", "Programa de desenvolvimento individual (PDI) 2026 lançado. Todos os colaboradores devem preencher até o dia 30. Formulário no link abaixo.", "link", { isNew: true, linkMeta: { title: "Formulário PDI 2026 — Plano de Desenvolvimento Individual", domain: "forms.google.com", image: "/assets/post-celebration.png", url: "#" } }),
    makePost("rh3", "Lembrete: avaliações de desempenho semestral encerram na próxima semana. 62% já concluíram. Não deixe para a última hora!", "text", { isNew: false }),
  ],
};

type Role = "admin" | "lider";

/* ── Channel Info Popover ─────────────────────────────────────────────────── */
/* ── Typing placeholder animation ─────────────────────────────────────── */
const PLACEHOLDER_PHRASES = [
  "Escreva sua publicação aqui...",
  "Compartilhe seus pensamentos...",
  "O que você gostaria de compartilhar?",
  "Conte as novidades para o time...",
  "Tem algo interessante para postar?",
  "Inspire seus colegas com uma ideia...",
  "Qual é a boa notícia de hoje?",
];

const TypingPlaceholder = () => {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const phrase = PLACEHOLDER_PHRASES[phraseIdx];

  useEffect(() => {
    if (!deleting && charIdx < phrase.length) {
      timeoutRef.current = setTimeout(() => setCharIdx(c => c + 1), 45);
    } else if (!deleting && charIdx === phrase.length) {
      timeoutRef.current = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && charIdx > 0) {
      timeoutRef.current = setTimeout(() => setCharIdx(c => c - 1), 25);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setPhraseIdx(i => (i + 1) % PLACEHOLDER_PHRASES.length);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [charIdx, deleting, phrase.length]);

  return (
    <span style={{ fontSize: 14, color: "#414651", userSelect: "none" }}>
      {phrase.slice(0, charIdx)}
      <span style={{ display: "inline-block", width: 2, height: 17, background: "#1570EF", marginLeft: 1, borderRadius: 1, verticalAlign: "text-bottom", animation: "blink 1s step-end infinite" }} />
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </span>
  );
};

const CHANNEL_META: Record<string, { members: number; posts: number; created: string; description: string }> = {
  "Geral":           { members: 128, posts: 1240, created: "Jan 2023", description: "Canal oficial para comunicados, novidades e alinhamentos gerais da empresa." },
  "Aniversariantes": { members: 128, posts: 312,  created: "Jan 2023", description: "Celebre os aniversários dos colaboradores e espalhe alegria pelo time!" },
  "Customer Success":{ members: 24,  posts: 430,  created: "Mar 2023", description: "Acompanhe métricas de NPS, casos de sucesso e estratégias de retenção." },
  "Desenvolvimento": { members: 31,  posts: 875,  created: "Jan 2023", description: "Discussões técnicas, deploys, code reviews e arquitetura de software." },
  "Financeiro":      { members: 12,  posts: 210,  created: "Feb 2023", description: "Relatórios financeiros, fechamentos mensais e comunicados do time." },
  "Jurídico":        { members: 8,   posts: 156,  created: "Apr 2023", description: "Contratos, compliance, LGPD e atualizações jurídicas relevantes." },
  "Marketing":       { members: 18,  posts: 390,  created: "Jan 2023", description: "Campanhas, resultados, A/B tests e estratégias de crescimento." },
  "Comercial":       { members: 22,  posts: 280,  created: "Mar 2023", description: "Pipeline de vendas, metas e estratégias do time comercial." },
  "Data & BI":       { members: 14,  posts: 195,  created: "May 2023", description: "Dashboards, análises de dados e insights de negócio." },
  "Tecnologia":      { members: 20,  posts: 340,  created: "Jan 2023", description: "Infra, segurança, DevOps e atualizações de sistemas." },
  "Comunicação":     { members: 16,  posts: 220,  created: "Jun 2023", description: "Newsletter interna, pesquisas e iniciativas de endomarketing." },
  "Operações":       { members: 19,  posts: 175,  created: "Feb 2023", description: "Processos, SLAs, auditorias e melhorias operacionais." },
  "Produtos":        { members: 26,  posts: 460,  created: "Jan 2023", description: "Roadmap, discovery, features e lançamentos de produto." },
  "RH":              { members: 10,  posts: 290,  created: "Jan 2023", description: "Recrutamento, PDI, avaliações e cultura organizacional." },
};

const ChannelInfoPopover = ({ channel, onClose }: { channel: ChannelInfo; onClose: () => void }) => {
  const meta = CHANNEL_META[channel.label] ?? { members: 0, posts: 0, created: "—", description: "Sem descrição disponível." };
  const Icon = channel.icon;

  return (
    <div style={{ width: 340, fontFamily: "Inter, sans-serif" }}>
      {/* Header gradient */}
      <div style={{ background: `linear-gradient(135deg, ${channel.iconBg}18 0%, ${channel.iconBg}08 100%)`, padding: "20px 20px 16px", borderBottom: "1px solid #F2F4F7" }}>
        <Flex align="center" gap={12}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: channel.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 4px 12px ${channel.iconBg}40` }}>
            <Icon size={20} color="#fff" strokeWidth={2} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Typography.Text strong style={{ fontSize: 15, color: "#101828", display: "block", lineHeight: "22px" }}>
              {channel.label}
            </Typography.Text>
            <Typography.Text style={{ fontSize: 12, color: "#667085" }}>
              Criado em {meta.created}
            </Typography.Text>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 6, color: "#98A2B3", display: "flex", lineHeight: 0 }}>
            <X size={15} />
          </button>
        </Flex>

        <Typography.Text style={{ fontSize: 13, color: "#475467", display: "block", marginTop: 12, lineHeight: "20px" }}>
          {meta.description}
        </Typography.Text>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: "1px solid #F2F4F7" }}>
        {[
          { label: "Membros", value: meta.members },
          { label: "Postagens", value: meta.posts },
          { label: "Ativos hoje", value: Math.floor(meta.members * 0.3) },
        ].map((stat) => (
          <div key={stat.label} style={{ padding: "14px 0", textAlign: "center" }}>
            <Typography.Text strong style={{ fontSize: 18, color: "#101828", display: "block", lineHeight: "26px" }}>
              {stat.value.toLocaleString("pt-BR")}
            </Typography.Text>
            <Typography.Text style={{ fontSize: 11, color: "#98A2B3", fontWeight: 500 }}>
              {stat.label}
            </Typography.Text>
          </div>
        ))}
      </div>

      {/* Rules */}
      <div style={{ padding: "14px 20px 16px" }}>
        <Typography.Text style={{ fontSize: 11, fontWeight: 600, color: "#98A2B3", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 10 }}>
          Diretrizes
        </Typography.Text>
        <Flex vertical gap={6}>
          {[
            "Comunicados e novidades relevantes",
            "Respeito e profissionalismo sempre",
            "Sem spam ou assuntos não relacionados",
          ].map((text) => (
            <Flex key={text} align="center" gap={8}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#D0D5DD", flexShrink: 0 }} />
              <Typography.Text style={{ fontSize: 13, color: "#344054", lineHeight: "20px" }}>{text}</Typography.Text>
            </Flex>
          ))}
        </Flex>
      </div>
    </div>
  );
};

const shimmer = `
@keyframes shimmer {
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
`;
const skeletonBar = (w: string | number, h: number, r = 6, mt = 0): React.CSSProperties => ({
  width: w, height: h, borderRadius: r, marginTop: mt,
  background: "linear-gradient(90deg, #F2F4F7 25%, #E9EAEB 50%, #F2F4F7 75%)",
  backgroundSize: "800px 100%",
  animation: "shimmer 1.5s ease-in-out infinite",
});

const PostsSkeleton = () => (
  <>
    <style>{shimmer}</style>
    {[0, 1, 2].map(i => (
      <div key={i} style={{ marginBottom: 16, background: "#fff", borderRadius: 16, border: "1px solid #E9EAEB", padding: "20px 24px" }}>
        <Flex align="center" gap={12} style={{ marginBottom: 14 }}>
          <div style={skeletonBar(40, 40, 99)} />
          <div>
            <div style={skeletonBar(140, 14)} />
            <div style={skeletonBar(80, 10, 4, 6)} />
          </div>
        </Flex>
        <div style={skeletonBar("100%", 12)} />
        <div style={skeletonBar("90%", 12, 6, 8)} />
        <div style={skeletonBar("70%", 12, 6, 8)} />
        {i === 1 && <div style={{ ...skeletonBar("100%", 180, 10), marginTop: 14 }} />}
        <div style={{ borderTop: "1px solid #F2F4F7", marginTop: 16, paddingTop: 12 }}>
          <Flex gap={24}>
            <div style={skeletonBar(70, 14)} />
            <div style={skeletonBar(90, 14)} />
            <div style={skeletonBar(100, 14)} />
          </Flex>
        </div>
      </div>
    ))}
  </>
);

const MainContent = () => {
  const { notification } = App.useApp();
  const [selectedChannel, setSelectedChannel] = useState<ChannelInfo>({
    label: "Geral", icon: Globe, iconBg: "#1570EF",
  });
  const [channelPosts, setChannelPosts] = useState<Record<string, PostType[]>>(initialChannelPosts);
  const [activeTab, setActiveTab] = useState("Timeline");
  const [membersOpen, setMembersOpen] = useState(false);
  const [channelPopoverOpen, setChannelPopoverOpen] = useState(false);
  const [memberCount, setMemberCount] = useState(8);
  const [role, setRole] = useState<Role>("admin");
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [pendenciasModalOpen, setPendenciasModalOpen] = useState(false);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [engagementSort, setEngagementSort] = useState<"default" | "likes" | "comments" | "score">("default");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [engagementDropOpen, setEngagementDropOpen] = useState(false);
  const [typeDropOpen, setTypeDropOpen] = useState(false);
  const [channelLoading, setChannelLoading] = useState(false);
  const [channelSettingsOpen, setChannelSettingsOpen] = useState(false);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([
    { id: "sp1",  author: "Bruno Oliveira Santos",           avatar: AVATARS["Bruno Delorence"],  content: "Novo comunicado sobre as mudanças no processo de onboarding que entram em vigor na próxima semana. Ouçam e compartilhem com o time!", scheduledAt: new Date(2026, 3, 17, 14, 0),  status: "agendado", channelLabel: "Geral", media: [{ id: "m1", type: "audio" as const }] },
    { id: "sp2",  author: "Ana Maria Silva Rodrigues",      avatar: AVATARS["Ana Costa"],         content: "Relatório trimestral disponível para revisão. Por favor, confiram os números antes da reunião de segunda-feira às 9h.", scheduledAt: new Date(2026, 3, 18, 9, 30),  status: "agendado", channelLabel: "Geral", media: [{ id: "m2", type: "document" as const, fileName: "Relatorio-Q1-2026.pdf", mimeType: "application/pdf" }] },
    { id: "sp3",  author: "Carlos Henrique Mendes",         avatar: AVATARS["Carlos Mendes"],     content: "Lembrete: prazo para envio das avaliações de desempenho semestral é esta semana. 62% já concluíram.", scheduledAt: new Date(2026, 3, 15, 11, 0),  status: "postado",  channelLabel: "Geral" },
    { id: "sp4",  author: "Fernanda Lima Costa",            avatar: AVATARS["Fernanda Lima"],     content: "Newsletter de Abril já está pronta para publicação. Confira os destaques do mês e as novidades da empresa.", scheduledAt: new Date(2026, 3, 14, 16, 45), status: "falhou",   channelLabel: "Geral" },
    { id: "sp5",  author: "Rafael Augusto Pereira",         avatar: AVATARS["Rafael Souza"],      content: "Atualização do manual de procedimentos operacionais publicada. Versão 4.1 substitui a anterior. Façam o download.", scheduledAt: new Date(2026, 3, 20, 8, 0),   status: "agendado", channelLabel: "Geral", media: [{ id: "m3", type: "image" as const, url: "/assets/post-corporate-meeting.png" }] },
    { id: "sp6",  author: "Juliana Souza Martins",          avatar: AVATARS["Juliana Rocha"],     content: "Registros do nosso workshop de inovação que rolou ontem. Foram mais de 40 participantes e 12 ideias priorizadas.", scheduledAt: new Date(2026, 3, 21, 10, 0),  status: "agendado", channelLabel: "Geral", media: [{ id: "m4a", type: "image" as const, url: "/assets/post-celebration.png" }, { id: "m4b", type: "image" as const, url: "/assets/post-corporate-meeting.png" }, { id: "m4c", type: "image" as const, url: "/assets/post-workspace-flatlay.png" }, { id: "m4d", type: "image" as const, url: "/assets/post-dev-office.png" }] },
    { id: "sp7",  author: "Pedro Henrique Cardoso Neto",    avatar: AVATARS["Pedro Alves"],       content: "Pesquisa de clima organizacional 2026 está aberta! Sua resposta é fundamental para melhorarmos o ambiente de trabalho.", scheduledAt: new Date(2026, 3, 22, 13, 0),  status: "agendado", channelLabel: "Geral" },
    { id: "sp8",  author: "Camila Ribeiro Duarte",          avatar: AVATARS["Camila Torres"],     content: "Resultado do NPS interno do mês de março: 72 pontos. Uma evolução de 8 pontos em relação ao mês anterior.", scheduledAt: new Date(2026, 3, 23, 15, 30), status: "falhou",   channelLabel: "Geral" },
    { id: "sp9",  author: "Diego Ramos Correia",            avatar: AVATARS["Diego Ferreira"],    content: "Convite para o treinamento obrigatório de segurança da informação. Inscrições abertas até sexta-feira.", scheduledAt: new Date(2026, 3, 24, 9, 0),   status: "agendado", channelLabel: "Geral", media: [{ id: "m5", type: "video" as const, url: "/assets/post-dev-office.png" }] },
    { id: "sp10", author: "Mariana Beatriz Oliveira",       avatar: AVATARS["Mariana Oliveira"],  content: "Boas-vindas aos novos colaboradores que iniciam hoje! Que essa jornada seja incrível para todos vocês.", scheduledAt: new Date(2026, 3, 25, 11, 0),  status: "postado",  channelLabel: "Geral", media: [{ id: "m6a", type: "image" as const, url: "/assets/post-celebration.png" }, { id: "m6b", type: "image" as const, url: "/assets/post-corporate-meeting.png" }] },
    { id: "sp11", author: "Gabriel Monteiro Pinto",         avatar: AVATARS["Bruno Delorence"],   content: "Aviso importante: o sistema de ponto eletrônico estará em manutenção no próximo sábado entre 8h e 12h.", scheduledAt: new Date(2026, 3, 26, 14, 0),  status: "agendado", channelLabel: "Geral" },
    { id: "sp12", author: "Larissa Andrade Vieira",         avatar: AVATARS["Ana Costa"],         content: "Compartilhando o resumo da reunião de alinhamento estratégico de Q2. Acesse o link para ver os próximos passos.", scheduledAt: new Date(2026, 3, 27, 8, 30),  status: "falhou",   channelLabel: "Geral" },
    { id: "sp13", author: "Mateus Borges Carvalho",         avatar: AVATARS["Carlos Mendes"],     content: "O programa de desenvolvimento de lideranças 2026 está com inscrições abertas. Vagas limitadas!", scheduledAt: new Date(2026, 3, 28, 10, 0),  status: "agendado", channelLabel: "Geral" },
    { id: "sp14", author: "Letícia Farias Gomes",           avatar: AVATARS["Fernanda Lima"],     content: "Comunicado sobre o benefício de auxílio home office: a partir de maio, o valor será reajustado.", scheduledAt: new Date(2026, 3, 29, 16, 0),  status: "postado",  channelLabel: "Geral" },
    { id: "sp15", author: "Thiago Nogueira Campos",         avatar: AVATARS["Rafael Souza"],      content: "Deadline de entrega das metas individuais para o gestor é dia 5 de maio. Não deixem para a última hora.", scheduledAt: new Date(2026, 4, 1, 9, 0),    status: "agendado", channelLabel: "Geral" },
    { id: "sp16", author: "Isabela Rocha Araújo",           avatar: AVATARS["Juliana Rocha"],     content: "Nova política de férias coletivas foi aprovada. Confira o documento atualizado no portal de RH.", scheduledAt: new Date(2026, 4, 2, 12, 0),   status: "agendado", channelLabel: "Geral" },
    { id: "sp17", author: "João Pedro Almeida Ferreira",    avatar: AVATARS["Pedro Alves"],       content: "Hackathon interno 2026 confirmado! Inscrições de equipes abertas a partir de hoje. Prepare seu time!", scheduledAt: new Date(2026, 4, 3, 14, 0),   status: "falhou",   channelLabel: "Geral" },
    { id: "sp18", author: "Beatriz Fernandes Moura",        avatar: AVATARS["Camila Torres"],     content: "Workshop de Design Thinking acontecerá na próxima semana. Confirmem presença pelo link no corpo da mensagem.", scheduledAt: new Date(2026, 4, 4, 10, 30), status: "agendado", channelLabel: "Geral" },
    { id: "sp19", author: "Patrícia Melo Azevedo",          avatar: AVATARS["Camila Torres"],     content: "Parabéns ao time de Vendas por bater a meta do trimestre com 3 dias de antecedência! Resultado histórico.", scheduledAt: new Date(2026, 4, 5, 15, 0),   status: "postado",  channelLabel: "Geral" },
    { id: "sp20", author: "Lucas Gabriel Teixeira",         avatar: AVATARS["Diego Ferreira"],    content: "Lembramos que o prazo para cadastro no programa de participação nos lucros encerra no final do mês.", scheduledAt: new Date(2026, 4, 6, 9, 0),    status: "agendado", channelLabel: "Geral" },
  ]);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [initialPostContent, setInitialPostContent] = useState("");

  const allPosts = channelPosts[selectedChannel.label] ?? [];

  const highEngagementThreshold = useMemo(() => {
    const list = channelPosts[selectedChannel.label] ?? [];
    if (list.length === 0) return Infinity;
    const scores = list.map((p) => postEngagementScore(p)).sort((a, b) => b - a);
    const idx = Math.min(scores.length - 1, Math.max(0, Math.ceil(scores.length * 0.35) - 1));
    return scores[idx];
  }, [channelPosts, selectedChannel.label]);

  const filteredPosts = allPosts.filter((post) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!post.content.toLowerCase().includes(q) && !post.author.toLowerCase().includes(q)) return false;
    }
    if (typeFilter !== "all" && post.type !== typeFilter) return false;
    return true;
  });

  const currentPosts =
    engagementSort === "default"
      ? filteredPosts
      : [...filteredPosts].sort((a, b) => {
          if (engagementSort === "likes") return b.likes - a.likes;
          if (engagementSort === "comments") return b.comments - a.comments;
          return postEngagementScore(b) - postEngagementScore(a);
        });

  const handleDeletePost = (id: string) => {
    setChannelPosts(prev => ({
      ...prev,
      [selectedChannel.label]: prev[selectedChannel.label].filter(p => p.id !== id),
    }));
  };

  const handleMemberCountChange = useCallback((c: number) => setMemberCount(c), []);

  const handlePublishPost = useCallback(({ content, media }: { content: string; media: { id: string; type: string; url?: string; title?: string; duration?: string }[] }) => {
    const imgs = media.filter(m => m.type === "image");
    const vids = media.filter(m => m.type === "video");
    const auds = media.filter(m => m.type === "audio");
    let type: any = "text";
    let postMedia: any = undefined;
    if (imgs.length === 1 && vids.length === 0 && auds.length === 0) {
      type = "photo"; postMedia = { images: [imgs[0].url] };
    } else if (imgs.length === 2 && vids.length === 0 && auds.length === 0) {
      type = "2photos"; postMedia = { images: imgs.map(i => i.url) };
    } else if (imgs.length >= 3) {
      type = "gallery"; postMedia = { images: imgs.map(i => i.url) };
    } else if (vids.length > 0) {
      type = "video"; postMedia = { videoCover: vids[0].url, videoDuration: vids[0].duration };
    } else if (auds.length > 0) {
      type = "audio"; postMedia = { audioTitle: auds[0].title, audioDuration: auds[0].duration };
    }

    const newPost: PostType = {
      id: String(Date.now()),
      author: "Bruno Delorence",
      avatar: AVATARS["Bruno Delorence"],
      time: "Agora",
      isNew: true,
      content,
      likes: 0,
      comments: 0,
      shares: 0,
      type,
      media: postMedia,
    };

    setChannelPosts(prev => ({
      ...prev,
      [selectedChannel.label]: [newPost, ...(prev[selectedChannel.label] ?? [])],
    }));
    setCreatePostOpen(false);

    notification.success({
      message: "Postagem publicada com sucesso",
      duration: 4,
      placement: "bottomLeft",
      icon: <CheckCircle2 size={18} style={{ color: "#079455" }} />,
      style: { borderRadius: 12, boxShadow: "0 8px 24px rgba(10,13,18,0.12)" },
    });
  }, [notification, selectedChannel.label]);

  const showNotif = useCallback((msg: string, type: "added" | "removed") => {
    if (type === "added") {
      notification.success({ message: "Usuário adicionado com sucesso", description: msg, duration: 4, placement: "topRight", icon: <CheckCircle2 size={18} style={{ color: "#079455" }} /> });
    } else {
      notification.error({ message: "Membro excluído com sucesso", description: msg, duration: 4, placement: "topRight", icon: <X size={18} style={{ color: "#D92D20" }} /> });
    }
  }, [notification]);

  const handleMembersAdded = useCallback((n: string) => showNotif(`${n} foi incluído no canal.`, "added"), [showNotif]);
  const handleMemberRemoved = useCallback((n: string) => showNotif(`${n} foi removido do canal.`, "removed"), [showNotif]);
  const handleCommentDeleted = useCallback(() => notification.success({ message: "Comentário excluído com sucesso", duration: 4, placement: "topRight" }), [notification]);

  const handleSchedulePost = useCallback((post: ScheduledPost) => {
    setScheduledPosts(prev => [...prev, post]);
    notification.success({
      message: "Postagem agendada com sucesso",
      description: `Será publicada em ${post.scheduledAt.toLocaleDateString("pt-BR")} às ${post.scheduledAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`,
      duration: 5,
      placement: "bottomLeft",
      icon: <CheckCircle2 size={18} style={{ color: "#079455" }} />,
      style: { borderRadius: 12, boxShadow: "0 8px 24px rgba(10,13,18,0.12)" },
    });
  }, [notification]);

  const handlePublishScheduled = useCallback((id: string) => {
    setScheduledPosts(prev => prev.map(p => p.id === id ? { ...p, status: "postado" as const } : p));
    notification.success({
      message: "Postagem publicada com sucesso",
      duration: 4,
      placement: "bottomLeft",
      icon: <CheckCircle2 size={18} style={{ color: "#079455" }} />,
      style: { borderRadius: 12 },
    });
  }, [notification]);

  const handleDeleteScheduled = useCallback((id: string) => {
    setScheduledPosts(prev => prev.filter(p => p.id !== id));
  }, []);

  const handleUpdateScheduled = useCallback((updated: ScheduledPost) => {
    setScheduledPosts(prev => prev.map(p => p.id === updated.id ? updated : p));
  }, []);

  const handleEmojiSelect = useCallback((emoji: string) => {
    setEmojiPickerOpen(false);
    setInitialPostContent(emoji + " ");
    setCreatePostOpen(true);
  }, []);

  const ChannelIcon = selectedChannel.icon;

  return (
    <main style={{ flex: 1, overflowY: "auto", background: "#F5F5F5" }} className="thin-scrollbar">

      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "24px 32px 32px" }}>

        {/* Page title */}
        <div style={{ marginBottom: 16 }}>
          <Typography.Title level={3} style={{ margin: 0, fontWeight: 600, color: "#272A31", fontSize: 30, lineHeight: "38px" }}>
            Módulo Início
          </Typography.Title>
          <Typography.Text style={{ fontSize: 14, color: "#717680" }}>
            Seu Feed de Informações e Interações
          </Typography.Text>
        </div>

        {/* ── Tabs card ── */}
        <div style={{ marginBottom: 20, background: "#fff", borderRadius: 16, border: "1px solid #E9EAEB", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <Segmented
            options={[
              { label: "Timeline", value: "Timeline" },
              { label: "Canais de Comunicação", value: "Canais de Comunicação" },
              { label: "Aniversariantes", value: "Aniversariantes" },
              { label: "Agenda", value: "Agenda" },
              { label: "Vagas", value: "Vagas" },
              ...(role === "admin" ? [{ label: "Pendências", value: "Pendências" }] : []),
            ]}
            value={activeTab === "Pendências" && role === "lider" ? "Timeline" : activeTab}
            onChange={(v) => setActiveTab(v as string)}
            style={{ background: "#F5F5F5", overflow: "visible", flex: 1 }}
          />

          {/* Role dropdown */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setRoleMenuOpen((v) => !v)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 14px", borderRadius: 8,
                border: "1px solid #D5D7DA", background: "#fff",
                fontSize: 14, fontWeight: 500, color: "#344054",
                cursor: "pointer", fontFamily: "inherit",
                boxShadow: "0 1px 2px rgba(10,13,18,0.05)",
              }}
            >
              {role === "admin" ? "Admin" : "Líder"} <ChevronDown size={16} />
            </button>
            {roleMenuOpen && (
              <>
                <div onClick={() => setRoleMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 99 }} />
                <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 100, background: "#fff", borderRadius: 10, border: "1px solid #E9EAEB", boxShadow: "0 8px 24px rgba(10,13,18,0.12)", minWidth: 140, overflow: "hidden" }}>
                  {(["admin", "lider"] as Role[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => { setRole(r); setRoleMenuOpen(false); if (r === "lider" && activeTab === "Pendências") setActiveTab("Timeline"); }}
                      style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", border: "none", background: role === r ? "#F5F8FF" : "#fff", fontSize: 14, color: role === r ? "#1570EF" : "#344054", fontWeight: role === r ? 600 : 400, cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}
                    >
                      {role === r && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1570EF", flexShrink: 0 }} />}
                      {r === "admin" ? "Admin" : "Líder"}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Pendências tab (full-width) ── */}
        {activeTab === "Pendências" && <PendenciasTab />}

        {/* ── Placeholder: Aniversariantes / Agenda / Vagas ── */}
        {(activeTab === "Aniversariantes" || activeTab === "Agenda" || activeTab === "Vagas") && (
          <div style={{ borderRadius: 16, border: "1px dashed #D5D7DA", background: "#FAFAFA", minHeight: 480, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <style>{`
              @keyframes ticker { 0% { transform: translateX(100%) } 100% { transform: translateX(-100%) } }
              @keyframes pulse-bar { 0%,100% { opacity:.35 } 50% { opacity:.7 } }
            `}</style>

            {/* Skeleton wireframe rows */}
            <div style={{ padding: "28px 32px 0", display: "flex", flexDirection: "column", gap: 14, opacity: 0.5 }}>
              {[["60%","28px"],["40%","20px"],["80%","16px"],["55%","16px"]].map(([w,h],i) => (
                <div key={i} style={{ height: h, width: w, borderRadius: 8, background: "#D5D7DA", animation: `pulse-bar 1.6s ease-in-out ${i*0.2}s infinite` }} />
              ))}
              <div style={{ display:"flex", gap:12, marginTop:4 }}>
                {["25%","30%","20%"].map((w,i) => (
                  <div key={i} style={{ height:80, width:w, borderRadius:12, background:"#D5D7DA", animation:`pulse-bar 1.6s ease-in-out ${i*0.15}s infinite` }} />
                ))}
              </div>
              {[["70%","14px"],["45%","14px"]].map(([w,h],i) => (
                <div key={i} style={{ height: h, width: w, borderRadius: 6, background: "#D5D7DA", animation: `pulse-bar 1.6s ease-in-out ${i*0.2+0.6}s infinite` }} />
              ))}
            </div>

            {/* Center badge */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, padding: "32px 0" }}>
              <div style={{ background: "#fff", border: "1px solid #E9EAEB", borderRadius: 14, padding: "18px 32px", boxShadow: "0 4px 16px rgba(10,13,18,0.08)", textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#344054", letterSpacing: "0.04em", textTransform: "uppercase" }}>Sem design ainda</div>
              </div>
            </div>

            {/* Ticker bar */}
            <div style={{ background: "#F2F4F7", borderTop: "1px solid #E9EAEB", padding: "8px 0", overflow: "hidden", position: "relative" }}>
              <div style={{ display: "inline-block", whiteSpace: "nowrap", animation: "ticker 18s linear infinite", fontSize: 12, fontWeight: 500, color: "#717680" }}>
                &nbsp;&nbsp;&nbsp;&nbsp;✦ &nbsp;Design Team ainda está passando isso pro Claude &nbsp;&nbsp;&nbsp;✦ &nbsp;Design Team ainda está passando isso pro Claude &nbsp;&nbsp;&nbsp;✦ &nbsp;Design Team ainda está passando isso pro Claude &nbsp;&nbsp;&nbsp;
              </div>
            </div>
          </div>
        )}

        {/* ── Timeline + Canais de Comunicação: feed completo ── */}
        {(activeTab === "Timeline" || activeTab === "Canais de Comunicação") && (
        <div>
        <Flex gap={20} align="flex-start">

          {/* Col 1: channels sidebar — apenas na tab Canais de Comunicação */}
          {activeTab === "Canais de Comunicação" && (
            <ChannelsSidebar
              selectedChannel={selectedChannel.label}
              onSelectChannel={(ch) => { setChannelLoading(true); setSelectedChannel(ch); setSearchQuery(""); setEngagementSort("default"); setTypeFilter("all"); setTimeout(() => setChannelLoading(false), 600); }}
              style={{ width: "33%", flexShrink: 0 }}
            />
          )}

          {/* Col 1 (esquerda): pendências widget — apenas na Timeline */}
          {activeTab === "Timeline" && (
            <PendenciasWidget
              onViewAll={() => setPendenciasModalOpen(true)}
              style={{ width: "33%", flexShrink: 0 }}
            />
          )}

          {/* Col 2: feed */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* ── Card de pesquisa ── */}
            <PesquisaCard />

            {/* ── Card 1+2: Cabeçalho do canal + Nova publicação ── */}
            <div style={{ marginBottom: 12, background: "#fff", borderRadius: 16, border: "1px solid #E9EAEB", boxShadow: "0 1px 2px rgba(10,13,18,0.05)" }}>
              <Flex align="center" justify="space-between" style={{ padding: "16px 24px" }}>
                <Flex align="center" gap={10}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: selectedChannel.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.2s" }}>
                    <ChannelIcon size={18} color="#fff" />
                  </div>
                  <Typography.Text strong style={{ fontSize: 16, color: "#181D27" }}>{selectedChannel.label}</Typography.Text>
                </Flex>
                <Flex align="center" gap={6}>
                  <Popover
                    open={channelPopoverOpen}
                    onOpenChange={setChannelPopoverOpen}
                    trigger="click"
                    placement="bottomLeft"
                    arrow={false}
                    overlayInnerStyle={{ padding: 0, borderRadius: 16, overflow: "hidden" }}
                    overlayStyle={{ width: 340 }}
                    content={<ChannelInfoPopover channel={selectedChannel} onClose={() => setChannelPopoverOpen(false)} />}
                  >
                    <button
                      type="button"
                      style={{ display: "flex", alignItems: "center", gap: 5, background: channelPopoverOpen ? "#F5F8FF" : "none", border: "none", cursor: "pointer", padding: "6px 8px", borderRadius: 8, fontFamily: "inherit", fontSize: 13, color: channelPopoverOpen ? "#1570EF" : "#535862", fontWeight: 500, transition: "all 0.15s" }}
                    >
                      <Info size={15} color={channelPopoverOpen ? "#1570EF" : "#717680"} />
                      <span>Informações do canal</span>
                    </button>
                  </Popover>
                  <button
                    type="button"
                    onClick={() => setMembersOpen(true)}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, border: "1px solid #D5D7DA", background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#344054", fontFamily: "inherit", boxShadow: "0 1px 2px rgba(10,13,18,0.05)" }}
                  >
                    <UserPlus size={15} color="#414651" />
                    Gerenciar membros
                  </button>
                  <Tooltip title="Configurações do canal">
                    <button
                      type="button"
                      onClick={() => setChannelSettingsOpen(true)}
                      style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, border: "1px solid #D5D7DA", background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#344054", fontFamily: "inherit", boxShadow: "0 1px 2px rgba(10,13,18,0.05)" }}
                    >
                      <Settings size={15} color="#414651" />
                    </button>
                  </Tooltip>
                </Flex>
              </Flex>
              <div style={{ borderTop: "1px solid #E9EAEB" }}>
                <Flex align="center" gap={10} style={{ padding: "14px 16px" }}>
                  <Avatar src={AVATARS["Bruno Delorence"]} size={40} style={{ flexShrink: 0, width: 40, height: 40, minWidth: 40 }} />
                  <div
                    onClick={() => setCreatePostOpen(true)}
                    style={{ flex: 1, height: 40, borderRadius: 8, border: "1px solid #D5D7DA", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 10px 0 14px", cursor: "pointer", background: "#fff", transition: "border-color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "#1570EF")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "#D5D7DA")}
                  >
                    <TypingPlaceholder />
                    <Popover
                      open={emojiPickerOpen}
                      onOpenChange={setEmojiPickerOpen}
                      trigger="click"
                      placement="topRight"
                      arrow={false}
                      overlayInnerStyle={{ padding: 0, borderRadius: 16, overflow: "hidden" }}
                      content={<EmojiPicker onSelect={handleEmojiSelect} />}
                    >
                      <button
                        type="button"
                        onClick={e => e.stopPropagation()}
                        style={{
                          background: emojiPickerOpen ? "#EFF8FF" : "none",
                          border: "none", cursor: "pointer",
                          display: "flex", alignItems: "center",
                          padding: 4, borderRadius: 6, flexShrink: 0,
                          transition: "background 0.15s",
                        }}
                      >
                        <Smile size={16} color={emojiPickerOpen ? "#1570EF" : "#A4A7AE"} />
                      </button>
                    </Popover>
                  </div>
                  <Flex align="center" gap={6} style={{ flexShrink: 0 }}>
                    <Tooltip title="Upload de mídia">
                      <button type="button" onClick={() => setCreatePostOpen(true)} style={headerIconBtnStyle}><ImageIcon size={16} color="#414651" /></button>
                    </Tooltip>
                    <Tooltip title="Documentos">
                      <button type="button" onClick={() => setCreatePostOpen(true)} style={headerIconBtnStyle}><Paperclip size={16} color="#414651" /></button>
                    </Tooltip>
                  </Flex>
                </Flex>
              </div>
            </div>

            {/* ── Card 3: Busca e filtros ── */}
            <div style={{ marginBottom: 16, background: "#fff", borderRadius: 16, border: "1px solid #E9EAEB", boxShadow: "0 1px 2px rgba(10,13,18,0.05)" }}>
              <Flex align="center" gap={12} style={{ padding: "14px 16px", flexWrap: "wrap" }}>
                <Input
                  prefix={<Search size={16} color="#A4A7AE" />}
                  placeholder={`Buscar postagem em ${selectedChannel.label}...`}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  allowClear
                  style={{ flex: 1, minWidth: 200, borderRadius: 8 }}
                />

                {/* Engajamento (ordenação) */}
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => { setEngagementDropOpen(v => !v); setTypeDropOpen(false); }}
                    style={{ ...filterBtnStyle, background: engagementSort !== "default" ? "#EFF8FF" : "#fff", color: engagementSort !== "default" ? "#1570EF" : "#535862", borderColor: engagementSort !== "default" ? "#B2DDFF" : "#E9EAEB" }}
                  >
                    {engagementSort === "default" ? "Engajamento" : engagementSort === "likes" ? "Mais curtidos" : engagementSort === "comments" ? "Mais comentados" : "Maior engajamento"}
                    <ChevronDown size={14} />
                  </button>
                  {engagementDropOpen && (
                    <>
                      <div onClick={() => setEngagementDropOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 99 }} />
                      <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 100, background: "#fff", borderRadius: 10, border: "1px solid #E9EAEB", boxShadow: "0 8px 24px rgba(10,13,18,0.12)", minWidth: 220, overflow: "hidden" }}>
                        {([
                          ["default", "Ordem do feed"],
                          ["likes", "Mais curtidos"],
                          ["comments", "Mais comentados"],
                          ["score", "Maior engajamento (geral)"],
                        ] as const).map(([val, label]) => (
                          <button
                            key={val}
                            onClick={() => { setEngagementSort(val); setEngagementDropOpen(false); }}
                            style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", border: "none", background: engagementSort === val ? "#F5F8FF" : "#fff", fontSize: 13, color: engagementSort === val ? "#1570EF" : "#344054", fontWeight: engagementSort === val ? 600 : 400, cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}
                          >
                            {engagementSort === val && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1570EF", flexShrink: 0 }} />}
                            {label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Type filter */}
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => { setTypeDropOpen(v => !v); setEngagementDropOpen(false); }}
                    style={{ ...filterBtnStyle, background: typeFilter !== "all" ? "#EFF8FF" : "#fff", color: typeFilter !== "all" ? "#1570EF" : "#535862", borderColor: typeFilter !== "all" ? "#B2DDFF" : "#E9EAEB" }}
                  >
                    {typeFilter === "all" ? "Filtrar por" : typeFilter === "text" ? "Texto" : typeFilter === "photo" || typeFilter === "2photos" || typeFilter === "gallery" ? "Fotos" : typeFilter === "video" ? "Vídeo" : typeFilter === "audio" || typeFilter === "audio_banner" ? "Áudio" : "Link"}
                    <ChevronDown size={14} />
                  </button>
                  {typeDropOpen && (
                    <>
                      <div onClick={() => setTypeDropOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 99 }} />
                      <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 100, background: "#fff", borderRadius: 10, border: "1px solid #E9EAEB", boxShadow: "0 8px 24px rgba(10,13,18,0.12)", minWidth: 160, overflow: "hidden" }}>
                        {([["all", "Todos os tipos"], ["text", "Texto"], ["photo", "Foto"], ["2photos", "Duas fotos"], ["gallery", "Galeria"], ["video", "Vídeo"], ["audio", "Áudio"], ["link", "Link"]] as const).map(([val, label]) => (
                          <button
                            key={val}
                            onClick={() => { setTypeFilter(val); setTypeDropOpen(false); }}
                            style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", border: "none", background: typeFilter === val ? "#F5F8FF" : "#fff", fontSize: 13, color: typeFilter === val ? "#1570EF" : "#344054", fontWeight: typeFilter === val ? 600 : 400, cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}
                          >
                            {typeFilter === val && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1570EF", flexShrink: 0 }} />}
                            {label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </Flex>

              {/* Active filters indicator */}
              {(searchQuery || engagementSort !== "default" || typeFilter !== "all") && (
                <Flex align="center" gap={8} style={{ padding: "0 16px 12px" }}>
                  <Typography.Text style={{ fontSize: 12, color: "#667085" }}>
                    {currentPosts.length} resultado{currentPosts.length !== 1 ? "s" : ""}
                  </Typography.Text>
                  {(engagementSort !== "default" || typeFilter !== "all" || searchQuery) && (
                    <button
                      onClick={() => { setSearchQuery(""); setEngagementSort("default"); setTypeFilter("all"); }}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#1570EF", fontWeight: 500, fontFamily: "inherit", padding: 0 }}
                    >
                      Limpar filtros
                    </button>
                  )}
                </Flex>
              )}
            </div>

            {/* ── Posts feed ── */}
            {channelLoading ? (
              <PostsSkeleton />
            ) : currentPosts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 24px", color: "#717680", background: "#fff", borderRadius: 16, border: "1px solid #E9EAEB" }}>
                <Typography.Text style={{ fontSize: 15, color: "#717680" }}>
                  Nenhuma publicação em <strong>{selectedChannel.label}</strong> ainda.
                </Typography.Text>
              </div>
            ) : (
              <Flex vertical gap={16}>
                {currentPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    author={post.author}
                    avatar={post.avatar}
                    time={post.time}
                    isNew={post.isNew}
                    content={post.content}
                    likes={post.likes}
                    showHighEngagementBadge={
                      role === "admin"
                      && postEngagementScore(post) >= highEngagementThreshold
                      && postEngagementScore(post) >= 48
                    }
                    comments={post.comments}
                    shares={post.shares}
                    type={post.type}
                    media={post.media}
                    linkMeta={post.linkMeta}
                    defaultCommentsOpen={false}
                    onDelete={() => handleDeletePost(post.id)}
                    onCommentDeleted={handleCommentDeleted}
                  />
                ))}
              </Flex>
            )}
          </div>

        </Flex>
        </div>
        )}
      </div>

      {/* Panels & modals */}
      <ChannelMembersModal open={membersOpen} onOpenChange={setMembersOpen} onMemberCountChange={handleMemberCountChange} onMembersAdded={handleMembersAdded} onMemberRemoved={handleMemberRemoved} />
      <PendenciasModal open={pendenciasModalOpen} onClose={() => setPendenciasModalOpen(false)} />
      <CreatePostModal
        open={createPostOpen}
        onClose={() => { setCreatePostOpen(false); setInitialPostContent(""); }}
        onPublish={handlePublishPost}
        onSchedulePost={handleSchedulePost}
        avatar={AVATARS["Bruno Delorence"]}
        initialContent={initialPostContent}
        channelLabel={selectedChannel.label}
      />
      <ChannelSettingsModal
        open={channelSettingsOpen}
        channel={selectedChannel}
        onClose={() => setChannelSettingsOpen(false)}
        scheduledPosts={scheduledPosts}
        onPublishScheduled={handlePublishScheduled}
        onDeleteScheduled={handleDeleteScheduled}
        onUpdateScheduled={handleUpdateScheduled}
      />
    </main>
  );
};

const iconBtnStyle: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, background: "none", border: "none", cursor: "pointer", borderRadius: 8, padding: 0 };
const headerIconBtnStyle: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, background: "#fff", border: "1px solid #E9EAEB", cursor: "pointer", borderRadius: 8, padding: 0, boxShadow: "0 1px 2px rgba(10,13,18,0.05)" };
const filterBtnStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "1px solid #E9EAEB", background: "#fff", color: "#535862", fontSize: 14, cursor: "pointer", fontFamily: "inherit" };

export default MainContent;
