import { Formula } from '../types';

export const getLatestFormulas = (formulas: Formula[]) => {
  return Array.from(
    formulas.reduce((acc, f) => {
      const groupId = f.originalFormulaId || f.id;
      const existing = acc.get(groupId);
      if (!existing || (f.version || 1) > (existing.version || 1)) {
        acc.set(groupId, f);
      }
      return acc;
    }, new Map<string, Formula>()).values()
  );
};
