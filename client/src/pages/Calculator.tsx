import { useState, useCallback, useEffect } from "react";
import * as math from "mathjs";
import { Display } from "@/components/Display";
import { Keypad } from "@/components/Keypad";
import { HistoryPanel } from "@/components/HistoryPanel";
import { useCreateCalculation } from "@/hooks/use-calculations";
import { Toaster } from "@/components/ui/toaster";
import { motion } from "framer-motion";

export default function Calculator() {
  const [expression, setExpression] = useState("");
  const [displayValue, setDisplayValue] = useState("");
  const [isNewCalculation, setIsNewCalculation] = useState(false);
  const [isError, setIsError] = useState(false);
  
  const { mutate: saveCalculation } = useCreateCalculation();

  const handleInput = useCallback((val: string) => {
    if (isError) {
      setIsError(false);
      setDisplayValue("");
      setExpression("");
    }

    if (isNewCalculation) {
      if (['+', '-', '*', '/', '%'].includes(val)) {
        // Continue with result
        setExpression(displayValue + val);
        setDisplayValue(displayValue);
      } else {
        // Start new
        setExpression("");
        setDisplayValue(val);
      }
      setIsNewCalculation(false);
    } else {
      if (['+', '-', '*', '/', '%'].includes(val)) {
        // Operator logic
        if (displayValue === "" && val === "-") {
          setDisplayValue("-");
          return;
        }
        setExpression(prev => prev + displayValue + val);
        setDisplayValue("");
      } else {
        // Number logic
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
    
    // Construct full expression to evaluate
    // If user presses = with "5 +", we ignore the operator or treat as invalid?
    // Let's just append current displayValue
    const fullExpression = expression + displayValue;
    
    try {
      // safe evaluation
      // Replace typical display chars with mathjs recognizable ones if needed
      // but mathjs handles +, -, *, / well.
      // NOTE: mathjs evaluate might return complex objects or numbers
      const result = math.evaluate(fullExpression);
      
      // Check for infinity or NaN
      if (!isFinite(result) || isNaN(result)) {
        throw new Error("Invalid calculation");
      }
      
      const formattedResult = String(Number(result.toPrecision(10))); // Avoid standard JS float precision errors
      
      // Save to history
      saveCalculation({
        expression: fullExpression,
        result: formattedResult
      });

      setExpression(fullExpression); // Show what was calculated
      setDisplayValue(formattedResult);
      setIsNewCalculation(true);
      setIsError(false);

    } catch (err) {
      setIsError(true);
      setDisplayValue("Error");
      setExpression("");
    }
  };

  // Keyboard support
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
      {/* Abstract background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-6 lg:gap-8 z-10">
        
        {/* Main Calculator */}
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
              Scientific Calculator • Python Powered
            </p>
          </div>
        </motion.div>

        {/* History Panel - Side on Desktop, Bottom on Mobile */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:w-96 w-full max-w-lg mx-auto lg:h-[680px] h-[400px]"
        >
          <HistoryPanel />
        </motion.div>
      </div>
      <Toaster />
    </div>
  );
}
