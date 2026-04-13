# Guia Detalhado de Git Flow da Zapfarma

Estado de referencia: 2026-04-09

Este guia documenta duas coisas ao mesmo tempo:

- como o repositorio funciona hoje, com base no historico real
- qual e o fluxo recomendado para o time seguir daqui para frente

O objetivo e evitar duvida na hora de criar branch, atualizar trabalho, integrar feature, limpar branches antigas e preparar o caminho para um Git Flow mais consistente.

## 1. Estrutura conceitual do Git Flow

No Git Flow classico, cada branch tem um papel claro:

- `main`: representa producao. Deve guardar apenas o que esta pronto para publicacao.
- `develop`: representa integracao continua. E a base para juntar features antes de subir para `main`.
- `feature/...`: trabalho de funcionalidades saem de `develop` e voltam para `develop`.
- `release/...`: preparacao de release, uma entrega para `main`.
- `hotfix/...`: corrigem urgencias saindo de `main` e voltando para `main` e `develop`

Esse modelo funciona bem porque separa:

- o que ja esta estavel para producao
- o que esta em integracao
- o que ainda esta em desenvolvimento isolado

## 2. Como este repositorio esta organizado hoje

### Branches locais relevantes

- `main`
- `develop`
- `feat/padronizacao-cores`

### Branches remotas relevantes

- `origin/main`
- `origin/develop`
- `origin/feat/docs/mapeamento-projeto`
- outras branches pontuais de trabalho antigo, documentacao e experimentacao

## 3. Fluxo recomendado para novos trabalhos

### Passo 1: Criar uma feature nova a partir de `develop`

Todo trabalho novo de funcionalidade deve nascer de `develop`.

```bash
git checkout develop
git pull origin develop
git checkout -b feature/nome-da-feature
```

### Passo 2: desenvolver e commitar

Durante o trabalho:

```bash
git status
git add .
git commit -m "feat(scope): descricao em pt-br"
```

Exemplos alinhados ao repositorio:

```bash
git commit -m "feat(hero): adiciona novas demonstracoes no chat"
git commit -m "fix(hero): ajusta autoscroll do mockup"
git commit -m "docs(brand): adiciona materiais de referencia"
```

### Passo 2.2: Atualizar sua feature com a `develop`

Com historico linear:

```bash
git checkout feat/minha-feature
git fetch origin
git rebase origin/develop
```

### Passo 3: publicar a branch

```bash
git push -u origin feature/nome-da-feature
```

## 4. Como atualizar uma feature durante o desenvolvimento

Existem duas estrategias principais: `merge` e `rebase`.

### Passo 4.1: atualizar com rebase

```bash
git checkout feat/minha-feature
git fetch origin
git rebase origin/develop
```

O que acontece:

- o Git encontra o ponto onde sua feature se separou de `develop`
- move sua branch para o topo da `develop` atual
- reaplica seus commits um por um

Quando usar:

- quando voce quer historico linear
- quando a branch ainda e basicamente sua
- quando voce quer "limpar" a feature antes da integracao

Se houver conflito:

```bash
git status
git add .
git rebase --continue
```

Para cancelar:

```bash
git rebase --abort
```

### Passo 4.2: integrar com merge

```bash
git checkout feat/minha-feature
git fetch origin
git merge origin/develop
```

Quando usar:

- quando voce quer simplicidade
- quando a branch ja foi compartilhada
- quando o time prefere preservar o historico exatamente como aconteceu

Vantagens:

- menos risco de confusao
- nao reescreve os hashes dos seus commits

Desvantagens:

- o historico pode ficar mais poluido com merges intermediarios

### Regra recomendada para este repositorio

- use `rebase` para atualizar sua feature com `develop`
- use `merge --no-ff` para integrar a feature em `develop`

## 5. O que `merge --no-ff` faz

Um merge simples pode fazer fast-forward. Isso significa que o Git apenas move o ponteiro da branch de destino para a frente, sem criar um commit de merge.

Exemplo simplificado:

```text
develop: A---B
feature:      C---D
```

Se `develop` ainda esta em `B`, um merge comum pode virar:

```text
develop: A---B---C---D
```

Com `--no-ff`, o Git forca um commit de merge:

```text
develop: A---B-------M
              \     /
               C---D
```

Por que isso e util:

- deixa claro que a mudanca veio de uma feature branch
- facilita leitura do historico
- facilita revert de um bloco inteiro de trabalho

Comando recomendado para integrar:

```bash
git checkout develop
git pull origin develop
git merge --no-ff feat/minha-feature
git push origin develop
```

## 6. Fluxo completo de feature ate integracao

### Fluxo recomendado

```bash
git checkout develop
git pull origin develop
git checkout -b feature/nova-feature

# desenvolvimento
git add .
git commit -m "feat(scope): descricao"

# atualizar a feature com develop quando necessario
git fetch origin
git rebase origin/develop

# publicar
git push -u origin feature/nova-feature

# integrar
git checkout develop
git pull origin develop
git merge --no-ff feature/nova-feature
git push origin develop

# limpeza local
git branch -d feature/nova-feature
```

## 7. Release e hotfix

### Release

Quando `develop` estiver pronta para virar producao:

```bash
git checkout develop
git pull origin develop
git checkout -b release/1.0.0
```

Ajustes finais de release:

- versao
- changelog
- detalhes finais de configuracao

Depois:

```bash
git checkout main
git merge --no-ff release/1.0.0
git tag v1.0.0
git push origin main --tags

git checkout develop
git merge --no-ff release/1.0.0
git push origin develop
```

### Hotfix

Quando uma correcao urgente precisa sair direto de producao:

```bash
git checkout main
git pull origin main
git checkout -b hotfix/correcao-urgente
```

Depois da correcao:

```bash
git checkout main
git merge --no-ff hotfix/correcao-urgente
git push origin main

git checkout develop
git merge --no-ff hotfix/correcao-urgente
git push origin develop
```

## 8. Branch remota removida: exemplo real de limpeza

Exemplo recente deste repositorio:

- a branch remota `origin/feat/hero-media` foi removida
- a branch local correspondente ficou sem upstream
- depois ela foi limpa localmente

Comandos uteis para esse cenario:

```bash
git fetch --all --prune
git branch -vv
git branch --unset-upstream nome-da-branch
git branch -d nome-da-branch
```

Se a branch local tiver commits que voce quer descartar mesmo sem merge:

```bash
git branch -D nome-da-branch
```

## 9. Problemas comuns no dia a dia

### Branch sem upstream

Sintoma:

- push e pull nao sabem para onde apontar

Correcao:

```bash
git branch --set-upstream-to=origin/minha-branch minha-branch
OU
git branch -u origin/minha-branch minha-branch
```

### Branch local atras do remoto

Sintoma:

- `git branch -vv` mostra `behind`

Correcao:

```bash
git pull --ff-only origin minha-branch
```

### Branch local a frente do remoto

Sintoma:

- `git branch -vv` mostra `ahead`

Correcao:

```bash
git push origin minha-branch
```

### Historico de feature ficou confuso

Correcao recomendada antes de integrar:

```bash
git checkout feat/minha-feature
git fetch origin
git rebase origin/develop
```

### Precisa manter historico claro na integracao

Correcao recomendada:

```bash
git checkout develop
git merge --no-ff feat/minha-feature
```
