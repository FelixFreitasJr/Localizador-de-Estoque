import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/Sidebar";
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
        <div className="min-h-screen bg-slate-50">
          <Sidebar />
          <main className="ml-64 min-h-screen p-8 md:p-12">
            <Router />
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
