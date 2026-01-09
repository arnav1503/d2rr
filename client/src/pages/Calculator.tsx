import { useState, useCallback, useEffect } from "react";
import * as math from "mathjs";
import { Display } from "@/components/Display";
import { Keypad } from "@/components/Keypad";
import { HistoryPanel } from "@/components/HistoryPanel";
import { Toaster } from "@/components/ui/toaster";
import { motion } from "framer-motion";

export interface Calculation {
  id: number;
  expression: string;
  result: string;
  createdAt?: string;
}

export default function Calculator() {
  const [expression, setExpression] = useState("");
  const [displayValue, setDisplayValue] = useState("");
  const [isNewCalculation, setIsNewCalculation] = useState(false);
  const [isError, setIsError] = useState(false);
  const [history, setHistory] = useState<Calculation[]>(() => {
    const saved = localStorage.getItem("calc_history");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("calc_history", JSON.stringify(history));
  }, [history]);

  const handleInput = useCallback((val: string) => {
    if (isError) {
      setIsError(false);
      setDisplayValue("");
      setExpression("");
    }

    if (isNewCalculation) {
      if (['+', '-', '*', '/', '%'].includes(val)) {
        setExpression(displayValue + val);
        setDisplayValue(displayValue);
      } else {
        setExpression("");
        setDisplayValue(val);
      }
      setIsNewCalculation(false);
    } else {
      if (['+', '-', '*', '/', '%'].includes(val)) {
        if (displayValue === "" && val === "-") {
          setDisplayValue("-");
          return;
        }
        setExpression(prev => prev + displayValue + val);
        setDisplayValue("");
      } else {
        if (val === "." && displayValue.includes(".")) return;
        setDisplayValue(prev => prev + val);
      }
    }
  }, [displayValue, isNewCalculation, isError]);

  const handleClear = () => {
    setExpression("");
    setDisplayValue("");
    setIsNewCalculation(false);
    setIsError(false);
  };

  const handleDelete = () => {
    if (isNewCalculation || isError) {
      handleClear();
      return;
    }
    setDisplayValue(prev => prev.slice(0, -1));
  };

  const handleEqual = () => {
    if (!displayValue && !expression) return;
    const fullExpression = expression + displayValue;
    
    try {
      const result = math.evaluate(fullExpression);
      if (!isFinite(result) || isNaN(result)) throw new Error("Invalid");
      
      const formattedResult = String(Number(result.toPrecision(10)));
      
      const newCalc: Calculation = {
        id: Date.now(),
        expression: fullExpression,
        result: formattedResult,
        createdAt: new Date().toISOString()
      };
      
      setHistory(prev => [newCalc, ...prev].slice(0, 50));
      setExpression(fullExpression);
      setDisplayValue(formattedResult);
      setIsNewCalculation(true);
      setIsError(false);
    } catch (err) {
      setIsError(true);
      setDisplayValue("Error");
      setExpression("");
    }
  };

  const clearHistory = () => {
    setHistory([]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (/[0-9.]/.test(key)) handleInput(key);
      if (['+', '-', '*', '/', '%'].includes(key)) handleInput(key);
      if (key === 'Enter' || key === '=') { e.preventDefault(); handleEqual(); }
      if (key === 'Backspace') handleDelete();
      if (key === 'Escape') handleClear();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInput, handleEqual]);

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 sm:p-8 font-body">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-6 lg:gap-8 z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 max-w-lg mx-auto w-full"
        >
          <div className="glass rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
            <Display 
              expression={expression} 
              result={displayValue} 
              isError={isError}
            />
            <div className="bg-card/50 backdrop-blur-md">
              <Keypad 
                onInput={handleInput}
                onClear={handleClear}
                onDelete={handleDelete}
                onEqual={handleEqual}
              />
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-muted-foreground/40 text-sm font-medium tracking-widest uppercase">
              Scientific Calculator • Static Mode
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:w-96 w-full max-w-lg mx-auto lg:h-[680px] h-[400px]"
        >
          <HistoryPanel history={history} onClear={clearHistory} />
        </motion.div>
      </div>
      <Toaster />
    </div>
  );
}
