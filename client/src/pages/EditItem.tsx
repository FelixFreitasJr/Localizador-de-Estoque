import { useItem, useUpdateItem } from "@/hooks/use-items";
import { ItemForm } from "@/components/ItemForm";
import { useLocation, useRoute } from "wouter";
import { ChevronLeft, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function EditItem() {
  const [_, params] = useRoute("/editar/:id");
  const id = params ? parseInt(params.id) : 0;
  
  const { data: item, isLoading, error } = useItem(id);
  const { mutateAsync: updateItem, isPending: isSaving } = useUpdateItem();
  const [__, setLocation] = useLocation();

  const handleSubmit = async (data: any) => {
    try {
      await updateItem({ id, ...data });
      setLocation("/");
    } catch (error) {
      // Error handled in hook toast
    }
  };

  if (isLoading) {
    return (
      <div className="h-[50vh] flex flex-col items-center justify-center text-slate-400 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p>Carregando dados do item...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="h-[50vh] flex flex-col items-center justify-center text-red-500 gap-4">
        <AlertCircle className="h-12 w-12" />
        <h3 className="text-xl font-bold">Item não encontrado</h3>
        <Link href="/">
          <Button variant="outline" className="mt-4">Voltar para a lista</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
            <ChevronLeft className="h-6 w-6 text-slate-500" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-display font-bold text-primary">Editar Item</h1>
          <p className="text-slate-500">Atualize as informações e localizações do material.</p>
        </div>
      </div>

      <div className="animate-in slide-in-from-bottom-4 duration-500 fade-in">
        <ItemForm 
          mode="edit"
          defaultValues={item} 
          onSubmit={handleSubmit} 
          isLoading={isSaving} 
        />
      </div>
    </div>
  );
}
