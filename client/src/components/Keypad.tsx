import { Button } from './ui/button';
import { Delete, RotateCcw } from 'lucide-react';

export function Keypad({ onInput, onClear, onDelete, onEqual }: { onInput: (v: string) => void; onClear: () => void; onDelete: () => void; onEqual: () => void }) {
  const keys = [
    { label: 'C', action: onClear, variant: 'destructive', icon: RotateCcw },
    { label: 'DEL', action: onDelete, variant: 'secondary', icon: Delete },
    { label: '%', action: () => onInput('%'), variant: 'secondary' },
    { label: '/', action: () => onInput('/'), variant: 'secondary' },
    { label: '7', action: () => onInput('7') },
    { label: '8', action: () => onInput('8') },
    { label: '9', action: () => onInput('9') },
    { label: '*', action: () => onInput('*'), variant: 'secondary' },
    { label: '4', action: () => onInput('4') },
    { label: '5', action: () => onInput('5') },
    { label: '6', action: () => onInput('6') },
    { label: '-', action: () => onInput('-'), variant: 'secondary' },
    { label: '1', action: () => onInput('1') },
    { label: '2', action: () => onInput('2') },
    { label: '3', action: () => onInput('3') },
    { label: '+', action: () => onInput('+'), variant: 'secondary' },
    { label: '0', action: () => onInput('0'), className: 'col-span-1' },
    { label: '.', action: () => onInput('.') },
    { label: '=', action: onEqual, variant: 'default', className: 'col-span-2' },
  ];

  return (
    <div className='grid grid-cols-4 gap-3 p-6'>
      {keys.map((key, i) => (
        <Button
          key={i}
          variant={(key.variant as any) || 'ghost'}
          onClick={key.action}
          className={key.className}
          size='lg'
        >
          {key.icon ? <key.icon className='h-5 w-5' /> : key.label}
        </Button>
      ))}
    </div>
  );
}
