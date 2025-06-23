import React from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Info } from 'lucide-react';
import { SmartMoneyScore } from '../types';

interface SmartMoneyVerdictProps {
  score: SmartMoneyScore;
  symbol: string;
}

export const SmartMoneyVerdict: React.FC<SmartMoneyVerdictProps> = ({ score, symbol }) => {
  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'Comprar': return 'text-green-600 bg-green-50 border-green-200';
      case 'Vender': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'Comprar': return <TrendingUp className="w-8 h-8" />;
      case 'Vender': return <TrendingDown className="w-8 h-8" />;
      default: return <Minus className="w-8 h-8" />;
    }
  };

  const getScoreColor = (totalScore: number) => {
    if (totalScore > 6) return 'text-green-600';
    if (totalScore < -6) return 'text-red-600';
    return 'text-yellow-600';
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Bajo': return 'text-green-600 bg-green-100';
      case 'Alto': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getScoreBar = (totalScore: number) => {
    const normalizedScore = ((totalScore + 10) / 20) * 100; // Convertir de -10/+10 a 0-100%
    
    return (
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ease-out ${
            totalScore > 6 ? 'bg-green-500' : 
            totalScore < -6 ? 'bg-red-500' : 
            'bg-yellow-500'
          }`}
          style={{ width: `${Math.max(5, Math.min(95, normalizedScore))}%` }}
        />
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Veredicto Smart Money
        </h2>
        <p className="text-gray-600">
          Análisis integral de <span className="font-semibold text-blue-600">{symbol}</span>
        </p>
      </div>

      {/* Recomendación Principal */}
      <div className={`rounded-lg border-2 p-6 mb-6 ${getRecommendationColor(score.recommendation)}`}>
        <div className="flex items-center justify-center gap-4 mb-4">
          {getRecommendationIcon(score.recommendation)}
          <h3 className="text-3xl font-bold">
            {score.recommendation.toUpperCase()}
          </h3>
        </div>
        
        <div className="text-center">
          <p className="text-lg mb-2">
            Score Smart Money: 
            <span className={`font-bold ml-2 ${getScoreColor(score.total_score)}`}>
              {score.total_score.toFixed(1)}/10
            </span>
          </p>
          {getScoreBar(score.total_score)}
        </div>
      </div>

      {/* Explicación */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Explicación del Análisis</h4>
            <p className="text-gray-700 leading-relaxed">
              {score.explanation}
            </p>
          </div>
        </div>
      </div>

      {/* Factores de Scoring */}
      <div className="space-y-3 mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Factores Analizados</h4>
        {score.factors.map((factor, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900">{factor.name}</span>
                <span className="text-sm text-gray-500">
                  ({(factor.weight * 100).toFixed(0)}%)
                </span>
              </div>
              <p className="text-sm text-gray-600">{factor.description}</p>
            </div>
            <div className="text-right ml-4">
              <div className={`text-lg font-bold ${
                factor.contribution > 0 ? 'text-green-600' : 
                factor.contribution < 0 ? 'text-red-600' : 'text-gray-600'
              }`}>
                {factor.contribution > 0 ? '+' : ''}{(factor.contribution * 10).toFixed(1)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Nivel de Riesgo */}
      <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-900">Nivel de Riesgo:</span>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskLevelColor(score.risk_level)}`}>
          {score.risk_level}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Disclaimer:</strong> Este análisis es solo para fines educativos y no constituye 
          asesoramiento financiero. Las inversiones conllevan riesgo de pérdida. Siempre realiza 
          tu propia investigación antes de tomar decisiones de inversión.
        </p>
      </div>
    </div>
  );
};
