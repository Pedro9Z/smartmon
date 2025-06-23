import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { PriceData, TechnicalIndicators } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface PriceChartProps {
  prices: PriceData[];
  technicalIndicators: TechnicalIndicators;
  symbol: string;
}

export const PriceChart: React.FC<PriceChartProps> = ({ 
  prices, 
  technicalIndicators, 
  symbol 
}) => {
  const chartData = useMemo(() => {
    const labels = prices.map(p => p.date);
    const closePrices = prices.map(p => p.close);
    
    // Calcular SMAs para mostrar en el gráfico
    const sma50Data = [];
    const sma200Data = [];
    
    for (let i = 0; i < prices.length; i++) {
      if (i >= 49) {
        const sma50 = closePrices.slice(i - 49, i + 1).reduce((a, b) => a + b, 0) / 50;
        sma50Data.push(sma50);
      } else {
        sma50Data.push(null);
      }
      
      if (i >= 199) {
        const sma200 = closePrices.slice(i - 199, i + 1).reduce((a, b) => a + b, 0) / 200;
        sma200Data.push(sma200);
      } else {
        sma200Data.push(null);
      }
    }

    return {
      labels,
      datasets: [
        {
          label: `${symbol} Precio de Cierre`,
          data: closePrices,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.1,
          pointRadius: 0,
          pointHoverRadius: 6,
        },
        {
          label: 'SMA 50',
          data: sma50Data,
          borderColor: 'rgb(251, 146, 60)',
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointRadius: 0,
          borderDash: [5, 5],
        },
        {
          label: 'SMA 200',
          data: sma200Data,
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointRadius: 0,
          borderDash: [10, 5],
        }
      ]
    };
  }, [prices, symbol]);

  const volumeData = useMemo(() => {
    return {
      labels: prices.map(p => p.date),
      datasets: [
        {
          label: 'Volumen',
          data: prices.map(p => p.volume),
          backgroundColor: prices.map((p, i) => {
            if (i === 0) return 'rgba(107, 114, 128, 0.6)';
            return p.close > prices[i - 1].close 
              ? 'rgba(34, 197, 94, 0.6)' 
              : 'rgba(239, 68, 68, 0.6)';
          }),
          borderColor: 'transparent',
          borderWidth: 0,
        }
      ]
    };
  }, [prices]);

  const priceOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 10,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: `${symbol} - Gráfico de Precios`,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('es-ES', {
                style: 'currency',
                currency: 'USD'
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day' as const,
        },
        title: {
          display: true,
          text: 'Fecha'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Precio (USD)'
        },
        ticks: {
          callback: function(value: any) {
            return new Intl.NumberFormat('es-ES', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0
            }).format(value);
          }
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    }
  };

  const volumeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Volumen de Transacciones',
        font: {
          size: 14,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Volumen: ${new Intl.NumberFormat('es-ES').format(context.parsed.y)}`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day' as const,
        },
        title: {
          display: true,
          text: 'Fecha'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Volumen'
        },
        ticks: {
          callback: function(value: any) {
            return new Intl.NumberFormat('es-ES', {
              notation: 'compact',
              compactDisplay: 'short'
            }).format(value);
          }
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="space-y-6">
        {/* Gráfico de Precios */}
        <div className="h-96">
          <Line data={chartData} options={priceOptions} />
        </div>

        {/* Indicadores Técnicos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-sm text-gray-600">RSI (14)</div>
            <div className={`text-lg font-bold ${
              technicalIndicators.rsi > 70 ? 'text-red-600' : 
              technicalIndicators.rsi < 30 ? 'text-green-600' : 'text-gray-900'
            }`}>
              {technicalIndicators.rsi.toFixed(1)}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-gray-600">MACD</div>
            <div className={`text-lg font-bold ${
              technicalIndicators.macd.macd > technicalIndicators.macd.signal ? 'text-green-600' : 'text-red-600'
            }`}>
              {technicalIndicators.macd.macd.toFixed(2)}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-gray-600">SMA 50</div>
            <div className="text-lg font-bold text-gray-900">
              ${technicalIndicators.sma_50.toFixed(2)}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-gray-600">Vol. Ratio</div>
            <div className={`text-lg font-bold ${
              technicalIndicators.volume_ratio > 1.5 ? 'text-green-600' : 
              technicalIndicators.volume_ratio < 0.8 ? 'text-red-600' : 'text-gray-900'
            }`}>
              {technicalIndicators.volume_ratio.toFixed(2)}x
            </div>
          </div>
        </div>

        {/* Gráfico de Volumen */}
        <div className="h-48">
          <Bar data={volumeData} options={volumeOptions} />
        </div>
      </div>
    </div>
  );
};
