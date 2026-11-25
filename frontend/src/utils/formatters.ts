/**
 * Formatting utilities for engineering metrics and timestamps
 */

export function formatPercent(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function formatNumber(value: number, decimals: number = 2): string {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatTimestamp(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export function formatTemperature(kelvin: number, showBoth: boolean = true): string {
  const celsius = kelvin - 273.15;
  if (showBoth) {
    return `${kelvin.toFixed(1)} K (${celsius.toFixed(1)} °C)`;
  }
  return `${kelvin.toFixed(1)} K`;
}
