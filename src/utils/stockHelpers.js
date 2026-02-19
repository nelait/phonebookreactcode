export const getTotalValue = (stock) => stock.quantity * stock.currentPrice;

export const getTotalCost = (stock) => stock.quantity * stock.purchasePrice;

export const getGainLoss = (stock) => getTotalValue(stock) - getTotalCost(stock);

export const getGainLossPercentage = (stock) => {
  if (stock.purchasePrice === 0) return 0;
  return ((stock.currentPrice - stock.purchasePrice) / stock.purchasePrice) * 100;
};

export const isGainer = (stock) => getGainLoss(stock) > 0;

export const isLoser = (stock) => getGainLoss(stock) < 0;

export const getPortfolioValue = (stocks) =>
  stocks.reduce((sum, s) => sum + getTotalValue(s), 0);

export const getPortfolioCost = (stocks) =>
  stocks.reduce((sum, s) => sum + getTotalCost(s), 0);

export const getPortfolioGainLoss = (stocks) =>
  getPortfolioValue(stocks) - getPortfolioCost(stocks);
