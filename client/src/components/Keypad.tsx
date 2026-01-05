import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface KeypadProps {
  onInput: (val: string) => void;
  onClear: () => void;
  onDelete: () => void;
  onEqual: () => void;
}

export function Keypad({ onInput, onClear, onDelete, onEqual }: KeypadProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  const Button = ({ 
    label, 
    onClick, 
    className, 
    variant = "default" 
  }: { 
    label: string | React.ReactNode, 
    onClick: () => void, 
    className?: string,
    variant?: "default" | "primary" | "secondary" | "danger"
  }) => (
    <motion.button
      variants={item}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "h-16 sm:h-20 rounded-2xl text-xl sm:text-2xl font-medium transition-colors select-none",
        variant === "default" && "glass-button text-foreground/90",
        variant === "primary" && "glass-button-primary font-bold text-2xl",
        variant === "secondary" && "bg-secondary/50 hover:bg-secondary/70 text-primary-foreground",
        variant === "danger" && "bg-destructive/20 hover:bg-destructive/30 text-destructive-foreground border border-destructive/20",
        className
      )}
    >
      {label}
    </motion.button>
  );

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-4 gap-3 sm:gap-4 p-4"
    >
      <Button label="AC" onClick={onClear} variant="danger" className="text-red-400" />
      <Button label="⌫" onClick={onDelete} variant="secondary" />
      <Button label="%" onClick={() => onInput("%")} variant="secondary" />
      <Button label="÷" onClick={() => onInput("/")} variant="secondary" className="text-primary font-bold" />

      <Button label="7" onClick={() => onInput("7")} />
      <Button label="8" onClick={() => onInput("8")} />
      <Button label="9" onClick={() => onInput("9")} />
      <Button label="×" onClick={() => onInput("*")} variant="secondary" className="text-primary font-bold" />

      <Button label="4" onClick={() => onInput("4")} />
      <Button label="5" onClick={() => onInput("5")} />
      <Button label="6" onClick={() => onInput("6")} />
      <Button label="-" onClick={() => onInput("-")} variant="secondary" className="text-primary font-bold" />

      <Button label="1" onClick={() => onInput("1")} />
      <Button label="2" onClick={() => onInput("2")} />
      <Button label="3" onClick={() => onInput("3")} />
      <Button label="+" onClick={() => onInput("+")} variant="secondary" className="text-primary font-bold" />

      <Button label="0" onClick={() => onInput("0")} className="col-span-2" />
      <Button label="." onClick={() => onInput(".")} />
      <Button label="=" onClick={onEqual} variant="primary" />
    </motion.div>
  );
}
