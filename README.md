# Cava+ Orça V1.1.1 — estabilização

Aplicação web estática com autenticação e persistência no Supabase. A interface existente foi preservada. O fluxo de análise prepara o documento e informa que a leitura automática será adicionada depois; não há resultados de IA simulados.

## Configuração necessária

Esta cópia está preparada, mas ainda não está conectada a um projeto: não foi fornecido/criado um projeto Supabase. **Não informe `service_role` em nenhum arquivo do cliente.**

1. Crie um projeto Supabase novo.
2. No SQL Editor, execute uma vez `supabase/schema.sql`. O arquivo é um bootstrap para banco novo, não uma migração de um banco V1 já criado.
3. Em Authentication, habilite cadastro por e-mail e defina `Site URL` e `Redirect URLs` para a URL de hospedagem. A confirmação de e-mail pode permanecer habilitada.
4. Em Project Settings → API, copie a **Project URL** e a chave **anon/public** para `supabase-config.js`, nos campos `CAVA_SUPABASE_URL` e `CAVA_SUPABASE_ANON_KEY`.
5. Hospede `index.html`, `app.js`, `styles.css` e `supabase-config.js` em uma origem HTTPS (ou servidor HTTP local). A configuração Auth de recuperação de senha deve permitir a URL dessa página.

A chave anon/public é destinada ao cliente e fica protegida pelas políticas RLS. O signup chama Supabase Auth; o trigger cria, na mesma transação, uma empresa, membership com papel `owner` e configuração inicial.

## Persistência e escopo

- A aplicação lê e grava projetos, quantitativos, origens, composições, insumos, orçamentos, grupos e itens no Supabase.
- Os dados principais não são salvos em `localStorage`. O seed antigo permanece como fixture de desenvolvimento, mas não é carregado na inicialização; usuário autenticado começa com os dados retornados pelo Supabase.
- Um PDF de até 20 MB é enviado para o bucket privado `project-documents`, com caminho por empresa/projeto. Visualização usa URL assinada de curta duração.
- Cada orçamento mantém seu BDI. Quantidade final vinculada acompanha a quantidade/perda do quantitativo; preço unitário vinculado acompanha o custo da composição. A tela de origem aceita várias fontes por quantitativo.
- Exportação CSV compatível com Excel e impressão/PDF usam o orçamento atualmente selecionado.
- Toda consulta e gravação requer uma sessão autenticada. RLS isola registros pela associação da empresa. Chaves estrangeiras compostas impedem relacionamentos entre tenants.

## Testes e limitações

`node --check app.js` passou; `node --test tests/*.test.js` passou com 8 testes de cálculos determinísticos, incluindo zero, perda zero, quantidade decimal, preço zero e BDI decimal. Testes de autenticação, upload, RLS e fluxo ponta a ponta requerem as credenciais e um projeto Supabase real; ainda não foram executados. O SQL foi revisado estaticamente; as políticas de leitura, gravação e exclusão do Storage exigem associação da empresa e existência do projeto indicado no caminho. O schema continua sendo bootstrap para projeto Supabase novo e não foi aplicado, pois ainda não há projeto/credenciais.

A leitura automática de PDFs, testes de isolamento multiusuário real, automações de análise, integração SINAPI e deploy não fazem parte desta versão. A biblioteca Supabase JS v2 é carregada do jsDelivr; para operação sem CDN, hospede a biblioteca localmente.
