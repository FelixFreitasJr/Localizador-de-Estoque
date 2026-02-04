import { Link, useLocation } from "wouter";
import { PlusCircle, PackageSearch, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Buscar Itens", icon: PackageSearch },
    { href: "/novo", label: "Adicionar Item", icon: PlusCircle },
  ];

  return (
    <div className="flex flex-col md:hidden bg-slate-900 text-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-bold">Estoque INI</h1>
        </div>
        <nav className="flex gap-4">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className={cn("p-2 rounded-lg", location === item.href ? "bg-primary" : "text-slate-400")}>
                <item.icon className="w-5 h-5" />
              </div>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
