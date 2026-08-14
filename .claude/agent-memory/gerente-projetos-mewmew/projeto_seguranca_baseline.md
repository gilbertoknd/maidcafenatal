---
name: projeto-seguranca-baseline
description: Baseline de segurança do backend Mew Mew e achados abertos da auditoria de Ago/2026 (ver GEMINI.md seção 34)
metadata:
  type: project
---

Auditoria defensiva de Ago/2026 documentada na **seção 34 do GEMINI.md** (diagnóstico, sem correções aplicadas). Verificar sempre o estado atual do código antes de agir — os achados podem já ter sido corrigidos e movidos para a seção 20.

**Sólido (não regredir):** SQL 100% parametrizado (`$1..$n`) em todos os models; toda rota admin com `autenticacaoMiddleware`; preço do pedido recalculado no banco (cliente não forja total); upload com filtro mimetype+extensão e nome randomizado; nenhum `.env` versionado; erros não vazam stack.

**Achados abertos mais graves (Ago/2026):**
- CRÍTICO: `JWT_SECRET || "segredo"` em `autenticacaoMiddleware.ts` e `AutenticacaoController.ts` — contradiz o que a seção 20 do GEMINI.md afirmava ("fallback removido"). Lição: o doc às vezes documenta uma correção que não está no código.
- ALTO: sem rate limiting no login (nenhum express-rate-limit); multer@2.0.2 e cadeia Express com CVEs de DoS.
- MÉDIO: nickname do admin (`KrasnowAdm`) + hash bcrypt versionados em `database/init.sql`; sem helmet; token JWT em localStorage.

**Why:** o dono pediu a varredura para corrigir depois; a ordem de correção recomendada está na seção 34.4.

**How to apply:** se o dono pedir para corrigir segurança, siga a ordem 34.4 (JWT fallback → rate limit → audit fix → helmet → validações zod) sempre via TDD. Ao recomendar, confirme antes com grep/Read que o achado ainda existe.
