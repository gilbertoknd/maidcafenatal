---
name: whitelist-configuracoes-duplicado
description: O whitelist CHAVES_VALIDAS do ConfiguracaoController duplica as chaves do frontend de propósito — não refatorar para importar entre pacotes
metadata:
  type: feedback
---

Não refatore o `CHAVES_VALIDAS` do `ConfiguracaoController` para importar as chaves do frontend (`frontend/src/types/Configuracao.ts`). A duplicação é um **débito conhecido e aceito**.

**Why:** backend e frontend são pacotes pnpm separados, com build e deploy independentes (o frontend é buildado estaticamente e servido por Nginx; o backend roda em Node). Um import cruzado acoplaria os dois pacotes em tempo de build sem ganho real.

**How to apply:** ao adicionar uma chave nova em `configuracoes` (`secao_home_*`, `nav_*`, etc.), adicione-a **manualmente nos dois lados** e trate isso como parte da definição de pronto.

**Atualização (Ago/2026):** a duplicação continua, mas deixou de ser silenciosa — `frontend/src/tests/contrato-configuracoes.test.ts` lê os dois arquivos via `fs` e falha apontando a chave que ficou de fora, nos dois sentidos. Se esse teste quebrar, a correção é sincronizar as listas, **não** relaxar o teste. Validar por regex (`/^secao_home_.+$/`) foi avaliado e descartado: aceitaria chave digitada errada em silêncio e conflita com o teste de `configuracao.test.ts` que exige rejeição de chave desconhecida.

Consequência prática que já causou bug em produção: os painéis `AdminSecoesHome` e `AdminNavbar` mandam **uma chave por vez** no `PUT /api/configuracoes`. Se a chave não estiver no whitelist do backend, o filtro esvazia o payload e o controller lança `AppError(..., 400)` — o admin vê "Erro ao salvar" e nenhum teste de frontend detecta. Por isso o teste de aceitação de chave nova deve enviar a chave **isolada**, não junto de outras válidas.

Relacionado: [[tdd-provar-falha-antes]]
