import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteConfirmDialogProps {
  onConfirm: () => void;
  itemName: string;
  isDeleting: boolean;
}

export function DeleteConfirmDialog({ onConfirm, itemName, isDeleting }: DeleteConfirmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-display text-red-600">
            Remover item?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base text-slate-600">
            Você tem certeza que deseja remover <strong>{itemName}</strong> do sistema?
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-lg border-none bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            className="rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium shadow-lg shadow-red-500/20"
            disabled={isDeleting}
          >
            {isDeleting ? "Removendo..." : "Sim, remover item"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
