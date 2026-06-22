import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { Home } from "@/pages/home";
import { Catalog } from "@/pages/catalog";
import { Article } from "@/pages/article";
import { Direction } from "@/pages/direction";
import { Authors } from "@/pages/authors";
import { News } from "@/pages/news";
import { Login } from "@/pages/login";
import { Register } from "@/pages/register";
import { Profile } from "@/pages/profile";
import { Submit } from "@/pages/submit";
import { AdminDashboard } from "@/pages/admin";
import { ProtectedRoute } from "@/router/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/catalog" component={Catalog} />
      <Route path="/articles/:id" component={Article} />
      <Route path="/directions/:slug" component={Direction} />
      <Route path="/authors" component={Authors} />
      <Route path="/news" component={News} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />

      <Route path="/profile">
        <ProtectedRoute allowedRoles={["автор", "администратор"]}>
          <Profile />
        </ProtectedRoute>
      </Route>

      <Route path="/submit">
        <ProtectedRoute allowedRoles={["автор", "администратор"]}>
          <Submit />
        </ProtectedRoute>
      </Route>

      <Route path="/admin">
        <ProtectedRoute allowedRoles={["администратор"]}>
          <AdminDashboard />
        </ProtectedRoute>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
