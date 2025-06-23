// Tipos para la aplicación Smart Money Analyzer
export interface PriceData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface FinancialData {
  symbol: string;
  prices: PriceData[];
  current_price?: number;
  market_cap?: number;
  fundamentals?: FundamentalData;
  technical_indicators?: TechnicalIndicators;
}

export interface FundamentalData {
  pe_ratio?: number;
  roe?: number;
  debt_to_equity?: number;
  revenue_growth?: number;
  eps?: number;
  dividend_yield?: number;
}

export interface TechnicalIndicators {
  rsi: number;
  macd: {
    macd: number;
    signal: number;
    histogram: number;
  };
  sma_50: number;
  sma_200: number;
  bollinger_bands: {
    upper: number;
    middle: number;
    lower: number;
  };
  volume_ratio: number;
}

export interface SmartMoneyScore {
  total_score: number;
  recommendation: 'Comprar' | 'Mantener' | 'Vender';
  factors: ScoreFactor[];
  explanation: string;
  risk_level: 'Bajo' | 'Medio' | 'Alto';
}

export interface ScoreFactor {
  name: string;
  weight: number;
  score: number;
  contribution: number;
  description: string;
}

export interface AnalysisResult {
  symbol: string;
  data: FinancialData;
  smart_money_score: SmartMoneyScore;
  last_updated: string;
}

export interface MarketSentiment {
  fear_greed_index: number;
  sentiment_label: string;
  market_volatility: number;
}

export interface WyckoffPhase {
  phase: 'Acumulación' | 'Distribución' | 'Tendencia Alcista' | 'Tendencia Bajista' | 'Rango';
  confidence: number;
  description: string;
}
