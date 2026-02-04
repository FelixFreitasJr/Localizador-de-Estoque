import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import CreateItem from "@/pages/CreateItem";
import EditItem from "@/pages/EditItem";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/novo" component={CreateItem} />
      <Route path="/editar/:id" component={EditItem} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-slate-50 flex flex-col">
          <main className="flex-1 p-4 md:p-12 pb-20">
            <Router />
          </main>
          <footer className="py-6 border-t border-slate-200 bg-white text-center text-slate-500 text-sm">
            Desenvolvido por{" "}
            <a 
              href="https://github.com/FelixFreitasJr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary font-semibold hover:underline"
            >
              Felix Freitas Jr
            </a>
          </footer>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
