import React, { useState, useRef, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';
import { DataService } from '../lib/api';

interface TickerInputProps {
  onAnalyze: (symbol: string) => void;
  isLoading: boolean;
}

export const TickerInput: React.FC<TickerInputProps> = ({ onAnalyze, isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputValue.length > 0) {
      const newSuggestions = DataService.getTickerSuggestions(inputValue);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  }, [inputValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onAnalyze(inputValue.trim().toUpperCase());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    onAnalyze(suggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const getTickerIcon = (ticker: string) => {
    if (ticker.includes('BTC') || ticker.includes('ETH') || ticker.includes('USD')) {
      return <TrendingUp className="w-4 h-4 text-orange-500" />;
    }
    return <TrendingDown className="w-4 h-4 text-blue-500" />;
  };

  return (
    <div className="w-full max-w-md mx-auto relative">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => inputValue.length > 0 && setShowSuggestions(true)}
            placeholder="Ingresa un ticker (ej: AAPL, BTC-USD)"
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg 
                     focus:border-blue-500 focus:outline-none transition-colors
                     text-lg placeholder-gray-400 bg-white shadow-sm"
            disabled={isLoading}
          />
        </div>
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 
                         rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3
                          transition-colors ${
                            index === selectedIndex ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                          }`}
              >
                {getTickerIcon(suggestion)}
                <span className="font-medium text-gray-900">{suggestion}</span>
                <span className="text-sm text-gray-500 ml-auto">
                  {suggestion.includes('USD') ? 'Cripto' : 'Acción'}
                </span>
              </button>
            ))}
          </div>
        )}
        
        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-600 
                   text-white py-3 px-6 rounded-lg font-semibold text-lg
                   hover:from-blue-700 hover:to-purple-700 transition-all duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transform hover:scale-105 active:scale-95"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Analizando...
            </div>
          ) : (
            'Analizar Smart Money'
          )}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Ejemplos populares: 
          <button 
            onClick={() => handleSuggestionClick('AAPL')}
            className="ml-2 text-blue-600 hover:underline font-medium"
          >
            AAPL
          </button>
          <span className="mx-1">•</span>
          <button 
            onClick={() => handleSuggestionClick('BTC-USD')}
            className="text-orange-600 hover:underline font-medium"
          >
            BTC-USD
          </button>
        </p>
      </div>
    </div>
  );
};
