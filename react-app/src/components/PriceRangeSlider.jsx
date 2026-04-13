import { useCallback } from 'react';
import { formatPrice } from '../utils/format';
import './PriceRangeSlider.css';

/**
 * Dual-thumb price range slider.
 *
 * Import:
 *   import PriceRangeSlider from './components/PriceRangeSlider';
 *
 * Usage:
 *   <PriceRangeSlider
 *     globalMin={meta.listings.min_price}
 *     globalMax={meta.listings.max_price}
 *     minValue={filters.minprice}
 *     maxValue={filters.maxprice}
 *     onChange={(min, max) => {
 *       handleFilterChange('minprice', min);
 *       handleFilterChange('maxprice', max);
 *     }}
 *   />
 */
export default function PriceRangeSlider({
  globalMin,
  globalMax,
  minValue,
  maxValue,
  onChange,
}) {
  const min = globalMin ?? 0;
  const max = globalMax ?? 1_000_000;
  const step = deriveStep(min, max);

  const currentMin = minValue ?? min;
  const currentMax = maxValue ?? max;

  const pct = useCallback(
    (val) => ((val - min) / (max - min)) * 100,
    [min, max]
  );

  const handleMinChange = (e) => {
    const val = Number(e.target.value);
    // Clamp: min thumb cannot exceed max thumb
    onChange(Math.min(val, currentMax - step), currentMax);
  };

  const handleMaxChange = (e) => {
    const val = Number(e.target.value);
    // Clamp: max thumb cannot go below min thumb
    onChange(currentMin, Math.max(val, currentMin + step));
  };

  // When both thumbs are pushed to the same end, raise the correct one on top
  // so the user can always drag them apart again.
  // If min thumb is near the maximum end, raise it; otherwise raise max thumb.
  const minZIndex = pct(currentMin) > 50 ? 4 : 3;
  const maxZIndex = pct(currentMin) > 50 ? 3 : 4;

  return (
    <div className="price-slider">
      <div className="price-slider__labels">
        <span className="price-slider__label price-slider__label--min">
          {formatPrice(currentMin)}
        </span>
        <span className="price-slider__label price-slider__label--max">
          {formatPrice(currentMax)}
        </span>
      </div>

      <div className="price-slider__track-wrapper">
        {/* Grey full-width track */}
        <div className="price-slider__track" />

        {/* Blue filled segment between the two thumbs */}
        <div
          className="price-slider__fill"
          style={{
            left: `${pct(currentMin)}%`,
            right: `${100 - pct(currentMax)}%`,
          }}
        />

        {/* Min thumb */}
        <input
          type="range"
          className="price-slider__input"
          style={{ zIndex: minZIndex }}
          min={min}
          max={max}
          step={step}
          value={currentMin}
          onChange={handleMinChange}
          aria-label="Minimum price"
          aria-valuetext={formatPrice(currentMin)}
        />

        {/* Max thumb */}
        <input
          type="range"
          className="price-slider__input"
          style={{ zIndex: maxZIndex }}
          min={min}
          max={max}
          step={step}
          value={currentMax}
          onChange={handleMaxChange}
          aria-label="Maximum price"
          aria-valuetext={formatPrice(currentMax)}
        />
      </div>

      <div className="price-slider__bounds">
        <span>{formatPrice(min)}</span>
        <span>{formatPrice(max)}</span>
      </div>
    </div>
  );
}

function deriveStep(min, max) {
  const range = max - min;
  if (range <= 100_000) return 1_000;
  if (range <= 500_000) return 2_500;
  if (range <= 2_000_000) return 5_000;
  return 10_000;
}