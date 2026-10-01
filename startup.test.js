const fs = require('node:fs');
const vm = require('node:vm');
const test = require('node:test');
const assert = require('node:assert/strict');
const calculations = require('../calculations.js');

function bootWithoutSupabase() {
  const elements = new Map();
  const listeners = {};
  function element(selector) {
    if (!elements.has(selector)) elements.set(selector, {
      style: {}, textContent: '', innerHTML: '', firstChild: { textContent: '' },
      classList: { add() {}, remove() {}, toggle() {} }
    });
    return elements.get(selector);
  }
  const context = {
    console: { info() {}, error() {} },
    document: { querySelector: element, querySelectorAll: () => [], addEventListener() {} },
    location: { hash: '', origin: 'https://cavasolucoes.github.io', pathname: '/ORCA/' },
    addEventListener: (name, callback) => { listeners[name] = callback; },
    setTimeout, clearTimeout, Intl, Date, URL, Blob, TextDecoder,
    FormData: class {}, crypto: { randomUUID: () => 'test-id' },
    CavaCalculations: calculations,
    CAVA_SUPABASE_URL: '', CAVA_SUPABASE_ANON_KEY: ''
  };
  context.window = context;
  vm.createContext(context);
  // Simula o global que pode ser exposto pela biblioteca Supabase carregada antes do app.js.
  vm.runInContext('var supabase = { globalFromSdk: true };', context);
  vm.runInContext(fs.readFileSync(require.resolve('../app.js'), 'utf8'), context, { filename: 'app.js' });
  return { context, elements, listeners };
}

test('sem credenciais, inicializa tela de configuração sem colidir com o global Supabase', () => {
  const { elements } = bootWithoutSupabase();
  assert.match(elements.get('#app').innerHTML, /O Supabase ainda não foi configurado/);
  assert.equal(elements.get('.sidebar').style.display, 'none');
});

test('hashchange renderiza o conteúdo das páginas sem recarregar', () => {
  const { context, elements, listeners } = bootWithoutSupabase();
  for (const [page, heading] of [
    ['dashboard', 'Bem-vindo'], ['projetos', 'Projetos'], ['orcamentos', 'Orçamento'],
    ['composicoes', 'Composições'], ['precos', 'Banco de preços'], ['configuracoes', 'Configurações']
  ]) {
    context.location.hash = `#${page}`;
    listeners.hashchange();
    assert.ok(elements.get('#app').innerHTML.includes(heading), `rota ${page} deve renderizar ${heading}`);
  }
});
