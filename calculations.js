(function (root) {
  const calculations = Object.freeze({
    finalQuantity: (quantity, lossPercent) => Math.round((Number(quantity) * (1 + Number(lossPercent) / 100) + Number.EPSILON) * 10000) / 10000,
    itemCost: (quantity, unitPrice) => Number(quantity) * Number(unitPrice),
    directCost: items => items.reduce((sum, item) => sum + calculations.itemCost(item.quantity, item.unit_price ?? item.price), 0),
    salePrice: (directCost, bdiPercent) => Number(directCost) * (1 + Number(bdiPercent) / 100),
    compositionUnitCost: items => items.reduce((sum, item) => sum + Number(item.coefficient ?? item.coef) * Number(item.unit_price ?? item.price), 0)
  });
  if (typeof module !== 'undefined' && module.exports) module.exports = calculations;
  if (root) root.CavaCalculations = calculations;
})(typeof window !== 'undefined' ? window : globalThis);
