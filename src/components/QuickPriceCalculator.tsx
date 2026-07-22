import { useState } from 'react';
import { costPerUnit, formatRM, recommendedPricePerUnit } from '../lib/pricing';

interface QuickPriceCalculatorProps {
  initialPriceBought?: number;
  initialQuantityPerPackage?: number;
  title?: string;
}

// Pass a `key` prop from the parent (e.g. the source record's id) so this
// remounts with fresh initial values instead of syncing them via an effect.
export function QuickPriceCalculator({
  initialPriceBought,
  initialQuantityPerPackage,
  title = 'Quick Price Calculator',
}: QuickPriceCalculatorProps) {
  const [priceBought, setPriceBought] = useState(initialPriceBought?.toString() ?? '');
  const [quantityPerPackage, setQuantityPerPackage] = useState(
    initialQuantityPerPackage?.toString() ?? '',
  );
  const [quantityToSell, setQuantityToSell] = useState('');

  const price = parseFloat(priceBought);
  const qty = parseFloat(quantityPerPackage);
  const valid = price > 0 && qty > 0;

  const cost = valid ? costPerUnit(price, qty) : 0;
  const recommended = valid ? recommendedPricePerUnit(cost) : 0;

  const sellQty = parseFloat(quantityToSell);
  const total = valid && sellQty > 0 ? recommended * sellQty : null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price bought (whole pack, RM)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={priceBought}
            onChange={(e) => setPriceBought(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity per package
          </label>
          <input
            type="number"
            min="0"
            step="1"
            value={quantityPerPackage}
            onChange={(e) => setQuantityPerPackage(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 rounded-lg bg-brand-50 p-4">
        <div>
          <div className="text-xs text-gray-500">Cost per unit</div>
          <div className="text-lg font-semibold text-gray-900">
            {valid ? formatRM(cost) : '—'}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Recommended price per unit</div>
          <div className="text-lg font-semibold text-brand-700">
            {valid ? formatRM(recommended) : '—'}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quantity to sell (optional)
        </label>
        <input
          type="number"
          min="0"
          step="1"
          placeholder="e.g. 10"
          value={quantityToSell}
          onChange={(e) => setQuantityToSell(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
        {total !== null && (
          <div className="mt-2 text-sm text-gray-700">
            Total for {quantityToSell} unit(s): <span className="font-semibold">{formatRM(total)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
