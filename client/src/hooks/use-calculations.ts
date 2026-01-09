import { useQuery, useMutation } from '@tanstack/react-query';
export function useCalculations() { return { data: [] }; }
export function useCreateCalculation() { return { mutate: () => {} }; }
export function useClearHistory() { return { mutate: () => {} }; }
