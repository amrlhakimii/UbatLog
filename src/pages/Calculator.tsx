import { QuickPriceCalculator } from '../components/QuickPriceCalculator';

export function Calculator() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="font-display text-xl font-extrabold tracking-tight text-gray-900">
        Quick Price Calculator
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Check a recommended price for any medication — nothing here is saved.
      </p>
      <div className="mt-6">
        <QuickPriceCalculator />
      </div>
    </div>
  );
}
