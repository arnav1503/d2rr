import React from 'react';
import { Switch, Route } from 'wouter';
import { Toaster } from './components/ui/toaster';
import { TooltipProvider } from './components/ui/tooltip';
import Calculator from './pages/Calculator';
import NotFound from './pages/not-found';

function Router() {
  return (
    <Switch>
      <Route path='/' component={Calculator} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <TooltipProvider>
      <Router />
      <Toaster />
    </TooltipProvider>
  );
}
