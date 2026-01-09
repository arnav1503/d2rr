import React, { useState, useCallback, useEffect } from 'react';
import * as math from 'mathjs';
import { Display } from '../components/Display';
import { Keypad } from '../components/Keypad';
import { Toaster } from '../components/ui/toaster';
import { motion } from 'framer-motion';

export default function Calculator() {
  const [expression, setExpression] = useState('');
  const [displayValue, setDisplayValue] = useState('');
  const [isNewCalculation, setIsNewCalculation] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleInput = useCallback((val: string) => {
    if (isError) {
      setIsError(false);
      setDisplayValue('');
      setExpression('');
    }

    if (isNewCalculation) {
      if (['+', '-', '*', '/', '%'].includes(val)) {
        setExpression(displayValue + val);
        setDisplayValue(displayValue);
      } else {
        setExpression('');
        setDisplayValue(val);
      }
      setIsNewCalculation(false);
    } else {
      if (['+', '-', '*', '/', '%'].includes(val)) {
        if (displayValue === '' && val === '-') {
          setDisplayValue('-');
          return;
        }
        setExpression(prev => prev + displayValue + val);
        setDisplayValue('');
      } else {
        if (val === '.' && displayValue.includes('.')) return;
        setDisplayValue(prev => prev + val);
      }
    }
  }, [displayValue, isNewCalculation, isError]);

  const handleClear = () => {
    setExpression('');
    setDisplayValue('');
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
      if (!isFinite(result) || isNaN(result)) throw new Error('Invalid');
      const formattedResult = String(Number(result.toPrecision(10)));
      setExpression(fullExpression);
      setDisplayValue(formattedResult);
      setIsNewCalculation(true);
      setIsError(false);
    } catch (err) {
      setIsError(true);
      setDisplayValue('Error');
      setExpression('');
    }
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
    <div className='min-h-screen w-full bg-background flex items-center justify-center p-4 sm:p-8 font-body'>
      <div className='fixed inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]' />
        <div className='absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]' />
      </div>
      <div className='w-full max-w-lg z-10'>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className='glass rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl shadow-black/50'>
            <Display expression={expression} result={displayValue} isError={isError} />
            <div className='bg-card/50 backdrop-blur-md'>
              <Keypad onInput={handleInput} onClear={handleClear} onDelete={handleDelete} onEqual={handleEqual} />
            </div>
          </div>
          <div className='mt-8 text-center'>
            <p className='text-muted-foreground/40 text-sm font-medium tracking-widest uppercase'>Scientific Calculator</p>
          </div>
        </motion.div>
      </div>
      <Toaster />
    </div>
  );
}
