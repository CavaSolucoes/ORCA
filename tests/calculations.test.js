const test = require('node:test');
const assert = require('node:assert/strict');
const calc = require('../calculations.js');

test('calcula quantidade final com perda percentual', () => {
  assert.equal(calc.finalQuantity(100, 10), 110);
});

test('calcula custo total de itens e custo direto', () => {
  const items = [{ quantity: 2, unit_price: 15.5 }, { quantity: 3, price: 10 }];
  assert.equal(calc.itemCost(2, 15.5), 31);
  assert.equal(calc.directCost(items), 61);
});

test('aplica BDI ao custo direto', () => {
  assert.equal(calc.salePrice(1000, 22), 1220);
});

test('calcula custo unitário da composição por coeficiente', () => {
  assert.equal(calc.compositionUnitCost([{ coefficient: 2, unit_price: 10 }, { coef: 0.5, price: 20 }]), 30);
});

test('trata zero e perda zero sem alterar a quantidade', () => {
  assert.equal(calc.finalQuantity(0, 10), 0);
  assert.equal(calc.finalQuantity(100, 0), 100);
});

test('preserva quantidade decimal com perda percentual', () => {
  assert.equal(calc.finalQuantity(2.5, 10), 2.75);
});

test('trata preço zero e BDI decimal', () => {
  assert.equal(calc.itemCost(12.5, 0), 0);
  assert.equal(calc.salePrice(1000, 12.5), 1125);
});

test('composição vazia tem custo unitário zero', () => {
  assert.equal(calc.compositionUnitCost([]), 0);
});
