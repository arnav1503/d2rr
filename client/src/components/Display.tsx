import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface DisplayProps {
  expression: string;
  result: string;
  isError: boolean;
}

export function Display({ expression, result, isError }: DisplayProps) {
  return (
    <div className="flex flex-col items-end justify-end h-32 sm:h-40 p-6 sm:p-8 bg-transparent relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <AnimatePresence mode="wait">
        <motion.div
          key="expression"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-muted-foreground font-mono text-sm sm:text-base h-6 mb-2 overflow-hidden text-ellipsis whitespace-nowrap w-full text-right"
        >
          {expression || " "}
        </motion.div>
      </AnimatePresence>

      <motion.div
        layout
        className={cn(
          "font-display font-light text-5xl sm:text-6xl tracking-tight w-full text-right overflow-hidden text-ellipsis whitespace-nowrap z-10",
          isError ? "text-destructive" : "text-foreground",
          result.length > 10 ? "text-3xl sm:text-4xl" : ""
        )}
      >
        <span className={result ? "" : "text-muted-foreground/30"}>
          {result || "0"}
        </span>
      </motion.div>
    </div>
  );
}
