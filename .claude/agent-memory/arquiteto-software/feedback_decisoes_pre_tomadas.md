---
name: feedback-decisoes-pre-tomadas
description: O usuário frequentemente chega com decisões arquiteturais já fechadas e pede plano (não implementação) — siga sem re-litigar, mas sinalize consequências técnicas que ele não previu
metadata:
  type: feedback
---

Quando o usuário lista "decisões já tomadas (não questione, apenas siga)", trate-as como restrições fixas do design, não como propostas a avaliar. Ele também costuma separar explicitamente as fases: "projete, NÃO implemente ainda" significa entregar plano de arquivos + pontos de integração, sem escrever código de produção.

**Why:** Ele já fez o trade-off (ex.: dados estáticos em vez de tabela no banco, para evitar CRUD no admin) e quer velocidade no plano, não uma revisão da decisão. Re-abrir o debate custa tempo e ele sinaliza isso no próprio prompt.

**How to apply:** Aceite as restrições, mas **continue apontando consequências técnicas que a decisão dispara e que ele não mencionou** — isso ele quer. Ele pede explicitamente "confirme lendo o código" e cita `arquivo:linha`, então verificação empírica antes de opinar é obrigatória; não responda de memória nem por analogia com outro ponto do codebase. Exemplo do que ele valoriza: descobrir que uma feature declarada "só frontend" ainda exige mudança no backend por causa de um whitelist de chaves.
