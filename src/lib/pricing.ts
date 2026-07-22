const MARGIN = 1.3;
const ROUNDING_STEP = 0.05;

export function costPerUnit(priceBought: number, quantityPerPackage: number): number {
  if (!quantityPerPackage) return 0;
  return priceBought / quantityPerPackage;
}

export function recommendedPricePerUnit(cost: number): number {
  const raw = cost * MARGIN;
  const rounded = Math.round(raw / ROUNDING_STEP) * ROUNDING_STEP;
  return Number(rounded.toFixed(2));
}

export function formatRM(value: number): string {
  return `RM ${value.toFixed(2)}`;
}
