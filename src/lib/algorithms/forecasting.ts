/**
 * Exponential Moving Average (EMA) Demand Forecasting Algorithm
 */

export interface HistoricalData {
  date: string;
  sales: number;
}

/**
 * Predicts next N periods based on EMA.
 * Alpha (smoothing factor) is between 0 and 1. Higher alpha discounts older observations faster.
 */
export function calculateEMA(data: HistoricalData[], periodsToPredict: number = 30, alpha: number = 0.3): number {
  if (data.length === 0) return 0;
  
  // Sort chronologically
  const sorted = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Calculate Initial SMA for the first few points (or just use the first point)
  let ema = sorted[0].sales;

  for (let i = 1; i < sorted.length; i++) {
    ema = (sorted[i].sales - ema) * alpha + ema;
  }

  // To predict future, in a simple EMA, the forecast for all future periods is the last EMA value,
  // potentially adjusted by a linear trend if we wanted Holt's method. 
  // We'll return the base EMA as the expected stable baseline demand.
  return Math.round(ema);
}
