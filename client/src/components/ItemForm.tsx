import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertItemSchema, type InsertItem } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";

interface ItemFormProps {
  defaultValues?: Partial<InsertItem>;
  onSubmit: (data: InsertItem) => Promise<void>;
  isLoading: boolean;
  mode: "create" | "edit";
}

export function ItemForm({ defaultValues, onSubmit, isLoading, mode }: ItemFormProps) {
  const form = useForm<InsertItem>({
    resolver: zodResolver(insertItemSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      locationExternal: "",
      locationSatellite: "",
      ...defaultValues,
    },
  });

  return (
    <Card className="p-6 md:p-8 bg-white border-none shadow-xl rounded-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-primary border-b border-primary/10 pb-2 mb-4">
                Informações Básicas
              </h3>
              
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">Código do Item</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: SER10" {...field} className="h-12 bg-slate-50 border-slate-200 focus:border-primary focus:ring-primary/20" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">Nome do Item</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Seringa 5ml" {...field} className="h-12 bg-slate-50 border-slate-200 focus:border-primary focus:ring-primary/20" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">Descrição / Observações</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detalhes adicionais..." 
                        className="min-h-[120px] bg-slate-50 border-slate-200 focus:border-primary focus:ring-primary/20 resize-none"
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-primary border-b border-primary/10 pb-2 mb-4">
                Localização
              </h3>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"/> Estoque Externo
                </h4>
                <FormField
                  control={form.control}
                  name="locationExternal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Localização</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Prateleira A1" value={field.value || ''} onChange={field.onChange} className="bg-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"/> Estoque Satélite
                </h4>
                <FormField
                  control={form.control}
                  name="locationSatellite"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Localização</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Armário 3" value={field.value || ''} onChange={field.onChange} className="bg-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-slate-100">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="h-12 px-8 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> 
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" /> 
                  {mode === 'create' ? 'Adicionar Item' : 'Salvar Alterações'}
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
