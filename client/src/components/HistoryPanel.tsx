import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Trash2, History, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import type { Calculation } from "@/pages/Calculator";

interface HistoryPanelProps {
  history: Calculation[];
  onClear: () => void;
}

export function HistoryPanel({ history, onClear }: HistoryPanelProps) {
  return (
    <div className="h-full flex flex-col glass rounded-3xl overflow-hidden border-0 bg-card/40">
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-foreground font-medium">
          <History className="w-5 h-5 text-primary" />
          <span>History</span>
        </div>
        {history.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 px-2 transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 p-4">
        {!history.length ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground/50">
            <Clock className="w-12 h-12 stroke-1 opacity-50" />
            <p className="text-sm">No recent calculations</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {history.map((calc, i) => (
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
                    {calc.createdAt && (
                      <span className="text-[10px] text-muted-foreground/30">
                        {format(new Date(calc.createdAt), "HH:mm")}
                      </span>
                    )}
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
