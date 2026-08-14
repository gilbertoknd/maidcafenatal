---
name: infra-delegacao-subagentes
description: Neste ambiente não existe ferramenta para despachar subagentes especializados (engenheiro-seguranca etc.)
metadata:
  type: project
---

Não há tool de dispatch de subagentes (`Task`/agent) exposta nesta sessão. Só existe o sistema de lista de tarefas (TaskCreate/TaskUpdate/TaskList/TaskGet), que apenas rastreia progresso — não executa agentes.

**Why:** ao coordenar a auditoria de segurança (Ago/2026), o prompt pedia delegar a `engenheiro-seguranca`, `backend-api-mvc`, `devops-infra-engineer`, `escritor-tecnico-docs`. Nenhum deles é invocável; ToolSearch por "subagent/dispatch/agent" não retornou tool de execução.

**How to apply:** quando pedirem para "delegar" trabalho técnico, use TaskCreate para decompor e rastrear, mas conduza a análise você mesmo com o rigor de cada especialista. Não prometa que um subagente fará — entregue diretamente. Se um dispatcher de agentes aparecer em sessão futura, revise esta nota.
