import { useState } from 'react';
import { Card } from './Card';
import { costPerUnit, formatRM, recommendedPricePerUnit } from '../lib/pricing';

interface QuickPriceCalculatorProps {
  initialPriceBought?: number;
  initialQuantityPerPackage?: number;
  title?: string;
}

const inputClass =
  'w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 transition-colors focus:border-brand-500 focus:bg-white focus:outline-none';

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
    <Card className="p-5">
      <h3 className="font-display text-base font-bold text-gray-900">{title}</h3>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label-eyebrow mb-1 block">Price bought (whole pack, RM)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={priceBought}
            onChange={(e) => setPriceBought(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="label-eyebrow mb-1 block">Quantity per package</label>
          <input
            type="number"
            min="0"
            step="1"
            value={quantityPerPackage}
            onChange={(e) => setQuantityPerPackage(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 rounded-2xl bg-gradient-to-br from-brand-50 to-white p-4">
        <div>
          <div className="label-eyebrow">Cost per unit</div>
          <div className="mt-1 text-lg font-bold text-gray-900">{valid ? formatRM(cost) : '—'}</div>
        </div>
        <div>
          <div className="label-eyebrow">Recommended price per unit</div>
          <div className="mt-1 text-lg font-bold text-brand-700">
            {valid ? formatRM(recommended) : '—'}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <label className="label-eyebrow mb-1 block">Quantity to sell (optional)</label>
        <input
          type="number"
          min="0"
          step="1"
          placeholder="e.g. 10"
          value={quantityToSell}
          onChange={(e) => setQuantityToSell(e.target.value)}
          className={inputClass}
        />
        {total !== null && (
          <div className="mt-2 text-sm text-gray-700">
            Total for {quantityToSell} unit(s): <span className="font-bold">{formatRM(total)}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
