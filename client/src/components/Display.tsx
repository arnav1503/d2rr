import { cn } from '../lib/utils';

export function Display({ expression, result, isError }: { expression: string; result: string; isError: boolean }) {
  return (
    <div className='p-8 flex flex-col items-end justify-end min-h-[160px] bg-black/20'>
      <div className='text-sm text-muted-foreground mb-2 h-5 overflow-hidden text-right w-full font-mono'>{expression}</div>
      <div className={cn('text-4xl font-semibold tracking-tight text-right w-full break-all font-mono transition-all', isError && 'text-destructive')}>
        {result || '0'}
      </div>
    </div>
  );
}
