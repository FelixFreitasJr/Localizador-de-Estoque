import { useCreateItem } from "@/hooks/use-items";
import { ItemForm } from "@/components/ItemForm";
import { useLocation } from "wouter";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function CreateItem() {
  const { mutateAsync: createItem, isPending } = useCreateItem();
  const [_, setLocation] = useLocation();

  const handleSubmit = async (data: any) => {
    try {
      await createItem(data);
      setLocation("/");
    } catch (error) {
      // Error handled in hook toast
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
            <ChevronLeft className="h-6 w-6 text-slate-500" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-display font-bold text-primary">Adicionar Novo Item</h1>
          <p className="text-slate-500">Preencha os dados abaixo para cadastrar um novo material no estoque.</p>
        </div>
      </div>

      <div className="animate-in slide-in-from-bottom-4 duration-500 fade-in">
        <ItemForm 
          mode="create" 
          onSubmit={handleSubmit} 
          isLoading={isPending} 
        />
      </div>
    </div>
  );
}
