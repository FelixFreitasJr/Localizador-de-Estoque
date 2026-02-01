import { useState } from "react";
import { useItems, useDeleteItem } from "@/hooks/use-items";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Search, Edit, MapPin, AlertCircle, Plus } from "lucide-react";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Home() {
  const [search, setSearch] = useState("");
  const { data: items, isLoading, error } = useItems(search);
  const deleteItem = useDeleteItem();

  const handleDelete = async (id: number) => {
    try {
      await deleteItem.mutateAsync(id);
    } catch (error) {
      // Error handled in hook toast
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl text-primary mb-2">Localizador de Estoque</h1>
          <p className="text-slate-500 text-lg">Gerencie e localize materiais hospitalares</p>
        </div>
        
        <Link href="/novo">
          <Button className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-200">
            <Plus className="mr-2 h-5 w-5" />
            Adicionar Novo Item
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <Card className="p-1 rounded-2xl shadow-lg border-none bg-white overflow-hidden">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50 h-6 w-6" />
          <Input
            className="w-full h-14 pl-14 pr-4 text-lg border-none focus-visible:ring-0 bg-transparent placeholder:text-slate-300"
            placeholder="Buscar por código, nome ou descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </Card>

      {/* Results Section */}
      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-slate-100 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-red-50 rounded-2xl border border-red-100">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-xl font-bold text-red-700">Erro ao carregar itens</h3>
          <p className="text-red-600 mt-2">Por favor, verifique sua conexão e tente novamente.</p>
        </div>
      ) : items?.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
          <div className="bg-slate-50 p-6 rounded-full mb-6">
            <Search className="h-10 w-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-700">Nenhum item encontrado</h3>
          <p className="text-slate-500 mt-2 max-w-sm">
            Não encontramos itens com o termo buscado. Tente outra palavra-chave ou adicione um novo item.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Mobile View: Cards */}
          <div className="md:hidden divide-y divide-slate-100">
            {items?.map((item) => (
              <div key={item.id} className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-primary bg-green-50 px-2 py-1 rounded uppercase tracking-wider mb-1 inline-block">
                      {item.code}
                    </span>
                    <h3 className="font-bold text-slate-900 text-lg">{item.name}</h3>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/editar/${item.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <DeleteConfirmDialog 
                      itemName={item.name} 
                      onConfirm={() => handleDelete(item.id)} 
                      isDeleting={deleteItem.isPending} 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50/50 p-3 rounded-xl">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter block mb-1">Externo</span>
                    <div className="flex items-center gap-1 text-sm font-medium text-slate-700">
                      <MapPin className="w-3 h-3 text-blue-500" />
                      {item.locationExternal || "N/A"}
                    </div>
                  </div>
                  <div className="bg-amber-50/50 p-3 rounded-xl">
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-tighter block mb-1">Satélite</span>
                    <div className="flex items-center gap-1 text-sm font-medium text-slate-700">
                      <MapPin className="w-3 h-3 text-amber-500" />
                      {item.locationSatellite || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View: Table */}
          <Table className="hidden md:table">
            <TableHeader className="bg-slate-50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[15%] py-4 pl-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Código</TableHead>
                <TableHead className="w-[30%] py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Item / Descrição</TableHead>
                <TableHead className="w-[20%] py-4 text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50/50">Local. Externo</TableHead>
                <TableHead className="w-[20%] py-4 text-xs font-bold text-amber-600 uppercase tracking-wider bg-amber-50/50">Local. Satélite</TableHead>
                <TableHead className="w-[15%] py-4 text-right pr-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items?.map((item) => (
                <TableRow key={item.id} className="group hover:bg-slate-50/80 transition-colors">
                  <TableCell className="pl-6 py-4">
                    <span className="font-bold text-primary bg-green-50 px-2 py-1 rounded text-sm uppercase tracking-wider">
                      {item.code}
                    </span>
                  </TableCell>
                  
                  <TableCell className="py-4 align-top">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-foreground text-base">{item.name}</span>
                      {item.description && (
                        <span className="text-sm text-slate-400 line-clamp-2">{item.description}</span>
                      )}
                      <span className="text-xs text-slate-300 mt-1">
                        Atualizado: {item.lastUpdated ? format(new Date(item.lastUpdated), "dd MMM yyyy", { locale: ptBR }) : '-'}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="align-top py-4 bg-blue-50/30">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      {item.locationExternal || "N/A"}
                    </div>
                  </TableCell>

                  <TableCell className="align-top py-4 bg-amber-50/30">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <MapPin className="w-4 h-4 text-amber-500" />
                      {item.locationSatellite || "N/A"}
                    </div>
                  </TableCell>

                  <TableCell className="text-right pr-6 align-top py-4">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/editar/${item.id}`}>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-primary hover:bg-green-50">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <DeleteConfirmDialog 
                        itemName={item.name} 
                        onConfirm={() => handleDelete(item.id)} 
                        isDeleting={deleteItem.isPending} 
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
