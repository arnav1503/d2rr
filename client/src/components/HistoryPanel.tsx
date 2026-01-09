import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Trash2, History, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCalculations, useClearHistory } from "@/hooks/use-calculations";
import { Button } from "@/components/ui/button";

export function HistoryPanel() {
  const { data: calculations, isLoading } = useCalculations();
  const { mutate: clearHistory, isPending: isClearing } = useClearHistory();

  return (
    <div className="h-full flex flex-col glass rounded-3xl overflow-hidden border-0 bg-card/40">
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-foreground font-medium">
          <History className="w-5 h-5 text-primary" />
          <span>History</span>
        </div>
        {calculations && calculations.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => clearHistory()}
            disabled={isClearing}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 px-2 transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3 text-muted-foreground">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <span className="text-sm">Loading history...</span>
          </div>
        ) : !calculations?.length ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground/50">
            <Clock className="w-12 h-12 stroke-1 opacity-50" />
            <p className="text-sm">No recent calculations</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {calculations.map((calc, i) => (
                <motion.div
                  key={calc.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 hover:border-white/10 cursor-default"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted-foreground font-mono">
                      {calc.expression}
                    </span>
                    {/* Only show date if it exists, though schema implies it might not be in select type if omitted */}
                    {/* Assuming backend returns created_at based on schema */}
                  </div>
                  <div className="text-right text-lg font-semibold text-foreground tracking-tight">
                    = {calc.result}
                  </div>
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
