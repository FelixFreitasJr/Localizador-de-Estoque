import { Link, useLocation } from "wouter";
import { LayoutDashboard, PlusCircle, PackageSearch, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Buscar Itens", icon: PackageSearch },
    { href: "/novo", label: "Adicionar Item", icon: PlusCircle },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 text-white shadow-2xl z-50 flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg shadow-lg shadow-primary/20">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg leading-tight">Estoque INI</h1>
            <p className="text-xs text-slate-400">Fiocruz</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer group",
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                  )}
                />
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-xl p-4">
          <p className="text-xs text-slate-400 font-medium mb-1">Status do Sistema</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-green-400 font-semibold">Operacional</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
