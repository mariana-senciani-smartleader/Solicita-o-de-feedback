import { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronRight,
  RotateCcw,
  Search,
  User,
  UserPlus,
  Users,
  X,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { avatar } from '@/lib/avatar';

export interface Collaborator {
  id: string;
  name: string;
  role: string;
  area: string;
  unit: string;
  country: string;
  avatar: string;
}

const ALL_COLLABORATORS: Collaborator[] = [
  { id: "1", name: "Bruno Delorence", role: "Product Design Lead", area: "Design", unit: "São Paulo - Morumbi", country: "Brasil", avatar: avatar("Bruno Delorence") },
  { id: "2", name: "Brandon Philips", role: "UX Designer", area: "UX", unit: "Rio Grande do Norte - Natal", country: "Brasil", avatar: avatar("Brandon Philips") },
  { id: "3", name: "Giana Dias", role: "Product Designer", area: "Product", unit: "Rio Grande do Sul - Porto Alegre", country: "Brasil", avatar: avatar("Giana Dias") },
  { id: "4", name: "Giana Gouse", role: "Desenvolvedor", area: "TI", unit: "Rio de Janeiro - Copacabana", country: "Brasil", avatar: avatar("Giana Gouse") },
  { id: "5", name: "Lindsey George", role: "Product Design Lead", area: "Research", unit: "São Paulo - Morumbi", country: "Brasil", avatar: avatar("Lindsey George") },
  { id: "6", name: "Zain Culhane", role: "Tech Lead", area: "Prototyping", unit: "São Paulo - Morumbi", country: "Brasil", avatar: avatar("Zain Culhane") },
  { id: "7", name: "Jordyn Workman", role: "Product Design Lead", area: "Prototyping", unit: "São Paulo - Morumbi", country: "Brasil", avatar: avatar("Jordyn Workman") },
  { id: "8", name: "Zain Korsgaard", role: "Tech Lead", area: "Wireframing", unit: "São Paulo - Morumbi", country: "Brasil", avatar: avatar("Zain Korsgaard") },
  { id: "9", name: "Chance Siphron", role: "Desenvolvedor", area: "Visual Design", unit: "São Paulo - Morumbi", country: "Brasil", avatar: avatar("Chance Siphron") },
  { id: "10", name: "Dulce Westervelt", role: "Product Lead", area: "Interaction Design", unit: "São Paulo - Morumbi", country: "Brasil", avatar: avatar("Dulce Westervelt") },
  { id: "11", name: "Ravi Singh", role: "UX Researcher", area: "Branding", unit: "São Paulo - Morumbi", country: "Brasil", avatar: avatar("Ravi Singh") },
  { id: "12", name: "Omar Patel", role: "Frontend Developer", area: "Animation", unit: "Rio Grande do Norte - Natal", country: "Brasil", avatar: avatar("Omar Patel") },
  { id: "13", name: "Sofia Torres", role: "Product Manager", area: "Accessibility", unit: "Rio Grande do Sul - Porto Alegre", country: "Brasil", avatar: avatar("Sofia Torres") },
  { id: "14", name: "Kiran Mehta", role: "Interaction Designer", area: "IA", unit: "Rio de Janeiro - Copacabana", country: "Brasil", avatar: avatar("Kiran Mehta") },
  { id: "15", name: "Liam O'Connor", role: "Data Analyst", area: "Desenvolvimento", unit: "São Paulo - Morumbi", country: "Brasil", avatar: avatar("Liam O'Connor") },
];

const FILTER_SECTIONS = [
  { key: "regional", label: "Regional" },
  { key: "unidades", label: "Unidades" },
  { key: "diretoria", label: "Diretoria" },
  { key: "area", label: "Área" },
  { key: "cargo", label: "Cargo chave" },
  { key: "nivel", label: "Nível de Importância" },
  { key: "especificidade", label: "Nível de Especificidade" },
  { key: "impacto", label: "Impacto da perda" },
  { key: "sucessores", label: "Sucessores" },
];

const REGIONAL_OPTIONS = ["Todos", "Selecionados", "Argentina", "Chile", "Brasil"] as const;

const PAGE_SIZE = 10;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateChannel?: () => void;
  onConfirmAdd?: (ids: string[], roles: Record<string, "Membro" | "Moderador">) => void;
  channelName?: string;
}

export default function AddMembersToChannelModal({
  open,
  onOpenChange,
  onCreateChannel,
  onConfirmAdd,
}: Props) {
  const [search, setSearch] = useState("");
  const [activeFilterKey, setActiveFilterKey] = useState("regional");
  const [activeRegionalOpts, setActiveRegionalOpts] = useState<string[]>(["Brasil"]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [roles, setRoles] = useState<Record<string, "Membro" | "Moderador">>({});
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    let list = ALL_COLLABORATORS.filter((c) => {
      const matchSearch =
        !search.trim() ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.role.toLowerCase().includes(search.toLowerCase()) ||
        c.area.toLowerCase().includes(search.toLowerCase());
      if (!matchSearch) return false;

      // If "Todos" is selected, just return true
      if (activeRegionalOpts.includes("Todos")) return true;
      // If none selected, maybe return all or none? Let's return all if none selected for now
      if (activeRegionalOpts.length === 0) return true;

      let matches = false;
      if (activeRegionalOpts.includes("Selecionados") && selectedIds.includes(c.id)) matches = true;
      if (activeRegionalOpts.includes(c.country)) matches = true;

      return matches;
    });
    return list;
  }, [search, activeRegionalOpts, selectedIds]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(
    () =>
      filtered.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
      ),
    [filtered, currentPage]
  );

  const addedList = useMemo(
    () => ALL_COLLABORATORS.filter((c) => selectedIds.includes(c.id)),
    [selectedIds]
  );

  const toggleRegionalOpt = (opt: string) => {
    setActiveRegionalOpts((prev) => {
      if (opt === "Todos") return ["Todos"];
      const withoutTodos = prev.filter(p => p !== "Todos");
      if (withoutTodos.includes(opt)) {
        return withoutTodos.filter(p => p !== opt);
      } else {
        return [...withoutTodos, opt];
      }
    });
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    const allSelected = paginated.length > 0 && paginated.every((r) => selectedIds.includes(r.id));
    if (allSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !paginated.some((r) => r.id === id))
      );
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        paginated.forEach((r) => next.add(r.id));
        return Array.from(next);
      });
    }
  };

  const setRole = (id: string, role: "Membro" | "Moderador") => {
    setRoles((prev) => ({ ...prev, [id]: role }));
  };

  const clearFilters = () => {
    setActiveRegionalOpts(["Todos"]);
    setSearch("");
  };

  const handleCreate = () => {
    if (onConfirmAdd) {
      onConfirmAdd(selectedIds, roles);
      setSelectedIds([]);
      setRoles({});
      setSearch("");
    } else {
      onCreateChannel?.();
    }
    onOpenChange(false);
  };

  const allOnPageSelected =
    paginated.length > 0 && paginated.every((r) => selectedIds.includes(r.id));

  // The modal is very wide.
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-7xl w-[95vw] p-0 gap-0 overflow-hidden flex flex-col max-h-[85vh] border-none rounded-2xl shadow-2xl bg-white"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Header */}
        <DialogHeader className="px-6 py-5 border-b border-gray-100 shrink-0 bg-white">
          <DialogTitle className="text-[17px] font-semibold text-gray-900 tracking-tight">
            Adicionar membros ao canal
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 min-h-0 overflow-hidden bg-white">
          {/* ── Left: Smart Filter Area (Split in two columns) ── */}
          <div className="w-[380px] shrink-0 border-r border-gray-100 flex flex-col bg-white">

            {/* Top row with "Smart Filter" */}
            <div className="flex flex-1 min-h-0">

              {/* Filter Categories */}
              <div className="w-[180px] border-r border-gray-100 flex flex-col pt-6">
                <div className="px-5 mb-4">
                  <h3 className="text-base font-semibold text-gray-900">
                    Smart Filter
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto w-full">
                  <ul className="flex flex-col w-full text-[13px] font-medium text-gray-600">
                    {FILTER_SECTIONS.map((section) => {
                      const isActive = activeFilterKey === section.key;
                      const hasBadge = section.key === "regional" && activeRegionalOpts.length > 0 && !activeRegionalOpts.includes("Todos");

                      return (
                        <li key={section.key}>
                          <button
                            onClick={() => setActiveFilterKey(section.key)}
                            className={cn(
                              "w-full flex items-center justify-between px-5 py-3 text-left transition-colors",
                              isActive
                                ? "bg-gray-50/50 text-gray-900"
                                : "hover:bg-gray-50/50 hover:text-gray-900"
                            )}
                          >
                            <span>{section.label}</span>
                            {isActive && (
                              <div className="flex items-center gap-2">
                                {hasBadge && (
                                  <span className="flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-red-500 text-[10px] text-white">
                                    {activeRegionalOpts.filter(o => o !== "Todos" && o !== "Selecionados").length || 1}
                                  </span>
                                )}
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                              </div>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              {/* Filter Details */}
              <div className="flex-1 flex flex-col pt-6 px-4">
                {activeFilterKey === "regional" && (
                  <>
                    <div className="relative mb-5">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 h-10 bg-white border-gray-200 rounded-lg text-[13px] shadow-sm focus-visible:ring-1 focus-visible:ring-brand-500"
                      />
                    </div>
                    <div className="space-y-3.5">
                      {REGIONAL_OPTIONS.map((opt) => (
                        <label
                          key={opt}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <Checkbox
                            checked={activeRegionalOpts.includes(opt)}
                            onCheckedChange={() => toggleRegionalOpt(opt)}
                            className="rounded h-4 w-4 border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                          />
                          <span className="text-[14px] text-gray-600 group-hover:text-gray-900">
                            {opt}
                          </span>
                        </label>
                      ))}
                    </div>
                  </>
                )}
                {activeFilterKey !== "regional" && (
                  <div className="flex items-center justify-center h-full text-sm text-gray-400">
                    Selecione opções
                  </div>
                )}
              </div>

            </div>

            {/* Bottom actions for Filter */}
            <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between shrink-0 bg-white">
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 text-[13px] text-gray-500 font-medium hover:text-gray-900 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                Limpar Filtro
              </button>
              <div className="flex items-center gap-4">
                <span className="text-[13px] text-gray-500">
                  {selectedIds.length} de {ALL_COLLABORATORS.length} selecionado
                </span>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-9 px-5 text-[13px] font-medium">
                  Salvar
                </Button>
              </div>
            </div>

          </div>

          {/* ── Center: Member list ── */}
          <section className="flex-1 flex flex-col min-w-0 border-r border-gray-100 bg-white">

            {/* Table Header */}
            <div className="grid grid-cols-[3fr_1.5fr_1.5fr_auto] gap-4 items-center px-6 py-4 border-b border-gray-100 bg-white text-[13px] font-medium text-gray-500 shrink-0">
              <div className="flex items-center gap-4">
                <Checkbox
                  checked={allOnPageSelected}
                  onCheckedChange={toggleAll}
                  className="rounded border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <span className="cursor-pointer" onClick={toggleAll}>Selecionar todos</span>
              </div>
              <span>Adicionar como</span>
              <button className="flex items-center gap-1.5 hover:text-gray-900 text-left">
                Unidade
                <ArrowRight className="h-3 w-3 rotate-90" />
              </button>
              <div className="w-8"></div> {/* Spacer for user-plus icon */}
            </div>

            {/* Table Body */}
            <ScrollArea className="flex-1 min-h-0">
              <div className="flex flex-col divide-y divide-gray-50">
                {paginated.map((row) => {
                  const isSelected = selectedIds.includes(row.id);
                  const role = roles[row.id] ?? "Membro";
                  return (
                    <div
                      key={row.id}
                      className="grid grid-cols-[3fr_1.5fr_1.5fr_auto] gap-4 items-center px-6 py-3.5 hover:bg-gray-50/50 transition-colors group"
                    >
                      {/* Col 1: Checkbox + Avatar + Info */}
                      <div className="flex items-center gap-4 min-w-0">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleOne(row.id)}
                          className="rounded border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 focus-visible:ring-1 focus-visible:ring-blue-600"
                        />
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar className="h-9 w-9 shrink-0">
                            <AvatarImage src={row.avatar} alt={row.name} />
                            <AvatarFallback className="text-xs bg-gray-100 text-gray-600 font-medium">
                              {row.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex flex-col gap-0.5">
                            <p className="text-[14px] font-semibold text-gray-900 truncate">
                              {row.name}
                            </p>
                            <p className="text-[12.5px] text-gray-500 truncate">
                              {row.role} <span className="text-gray-300 px-1">|</span> {row.area}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Col 2: Role Selector */}
                      <div>
                        <Select
                          value={role}
                          onValueChange={(v) =>
                            setRole(row.id, v as "Membro" | "Moderador")
                          }
                        >
                          <SelectTrigger className="h-9 w-32 border-gray-200 bg-white text-[13px] text-gray-700 font-medium focus:ring-1 focus:ring-blue-600 rounded-lg">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-lg">
                            <SelectItem value="Membro">Membro</SelectItem>
                            <SelectItem value="Moderador">Moderador</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Col 3: Unit */}
                      <p className="text-[13px] text-gray-600 truncate pr-4">
                        {row.unit}
                      </p>

                      {/* Col 4: Action */}
                      <button
                        className="h-8 w-8 rounded-full flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        onClick={() => toggleOne(row.id)}
                      >
                        <UserPlus className="h-[18px] w-[18px]" strokeWidth={2} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Pagination inside Center part */}
            {totalPages > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 shrink-0 bg-white">
                <button
                  className="flex items-center gap-2 text-[13px] font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:pointer-events-none"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {[1, 2, 3, "...", 8, 9, 10].map((p, i) => (
                    <button
                      key={i}
                      disabled={p === "..."}
                      className={cn(
                        "w-8 h-8 rounded-md flex items-center justify-center text-[13px] font-medium transition-colors",
                        p === "..."
                          ? "text-gray-400 cursor-default"
                          : p === currentPage
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                      onClick={() => p !== "..." && setCurrentPage(p as number)}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  className="flex items-center gap-2 text-[13px] font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:pointer-events-none"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </section>

          {/* ── Right: Added members or Empty State ── */}
          <aside className="w-[280px] shrink-0 flex flex-col bg-white">
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-0">
              {addedList.length === 0 ? (
                <>
                  <div className="relative mb-6">
                    <div className="w-[72px] h-[80px] bg-[#f9fafb] rounded-[18px] flex items-center justify-center border border-gray-100">
                      <User className="h-8 w-8 text-gray-300" strokeWidth={1.5} />
                    </div>
                    <div className="absolute -bottom-2 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 border-[3px] border-white shadow-sm">
                      <UserPlus className="h-4 w-4 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  <h4 className="text-[15px] font-semibold text-gray-900 mb-2 leading-[1.4] mt-4">
                    Nenhum participante<br />foi adicionado ao canal
                  </h4>
                  <p className="text-[13px] text-[#8e95a2] leading-[1.5]">
                    Selecione os participantes<br />ao lado que irão participar<br />deste canal
                  </p>
                </>
              ) : (
                <div className="w-full h-full flex flex-col">
                  <h4 className="text-[14px] font-semibold text-gray-900 mb-4 text-left">
                    Participantes ({addedList.length})
                  </h4>
                  <ScrollArea className="flex-1 -mx-4 px-4 w-[calc(100%+32px)]">
                    <div className="flex flex-col gap-3">
                      {addedList.map(user => (
                        <div key={user.id} className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="text-xs bg-gray-100 text-gray-600 font-medium">
                              {user.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col items-start min-w-0 flex-1">
                            <span className="text-[13px] font-medium text-gray-900 truncate w-full text-left">{user.name}</span>
                            <span className="text-[11px] text-gray-500 truncate w-full text-left">{roles[user.id] || 'Membro'}</span>
                          </div>
                          <button
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            onClick={() => toggleOne(user.id)}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-5 border-t border-gray-100 bg-white shrink-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-lg h-10 px-6 text-[14px] font-medium border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleCreate}
            disabled={onConfirmAdd !== undefined && selectedIds.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-10 px-6 text-[14px] font-medium disabled:opacity-50"
          >
            {onConfirmAdd ? `Adicionar${selectedIds.length > 0 ? ` (${selectedIds.length})` : ""}` : "Criar canal"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
