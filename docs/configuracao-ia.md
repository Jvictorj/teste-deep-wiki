# Configuração da página de captação da IA

Este documento registra a criação da tela de captação de dados para configurar a IA da Zapfarma.

## Componentes criados e atualizados

- `ConfiguracaoIaComponent` (`src/app/pages/configuracao-ia/`): formulário reativo completo (standalone) cobrindo:
  - Dados corporativos: nome da empresa/IA, CNPJ, segmento, unidades, telefone de delivery com máscara, horário exibido ao cliente.
  - Contato responsável: bloco reativo com observação indicando que o acompanhamento deve ser feito por alguém da drogaria; campos com validação e máscara.
  - Operação atual: volume de atendimentos, canais, sistemas integrados.
  - Estratégia da IA: objetivos, tom de voz, palavras-chave obrigatórias, bases de conhecimento, regras de horário/transferência, restrições e observações.
  - Operação logística e serviços: taxa/isenção de entrega (com máscara monetária), genéricos, Farmácia Popular/preços populares, serviços oferecidos, gatilhos de transferência para humano, formas de pagamento, modelo de pedido (padrão/customizado).
  - Consentimento LGPD obrigatório, feedback de envio e mensagens de erro consistentes.
- UI/UX: CTA “Configurar IA” inserido na toolbar pública (`src/app/shared/toolbar/*`) com espaçamento ajustado para não sobrepor o conteúdo; notas e tipografia adequadas no formulário para evitar quebra de layout.
- `IaConfiguracaoService` (`src/app/services/ia-configuracao/`): serviço responsável por enviar o payload para `POST ${environment.apiProd}/ia-configuracoes`, contendo todos os campos acima + flag `consentimentoLgpd`. Payload completo (`IaConfiguracaoPayload`):
  ```ts
  interface IaConfiguracaoPayload {
    empresa: string;
    nomeIa: string;
    cnpj: string;
    segmento: string;
    numeroFiliais: string;
    numeroDelivery: string;
    horarioAtendimento: string;
    responsavel: string;
    email: string;
    telefone: string;
    volumeAtendimentos: string;
    canaisAtendimento: string;
    sistemasIntegrados: string;
    objetivosIa: string;
    tomDeVoz: string;
    palavrasChave: string;
    baseConhecimento: string;
    horariosAtendimento: string;
    taxaEntrega: string;
    valorIsencaoTaxa: string;
    trabalhaGenericos: string;
    programaPrecoPopular: string;
    servicosDrogaria: string;
    gatilhosTransferenciaHumano: string;
    formasPagamento: string;
    modeloPedido: string;
    restricoes: string;
    observacoes: string;
    consentimentoLgpd: boolean;
  }
  ```
  Exemplo de chamada:
  ```ts
  this.http.post(`${environment.apiProd}/ia-configuracoes`, payload);
  ```
- Documentação adicional: script de criação da tabela `ia_configuracoes` (`docs/ia-configuracoes-table.sql`) refletindo o payload completo (colunas para todos os campos + `created_at`). Script:
  ```sql
  CREATE TABLE ia_configuracoes (
      id SERIAL PRIMARY KEY,
      empresa VARCHAR(255) NOT NULL,
      nome_ia VARCHAR(255) NOT NULL,
      cnpj VARCHAR(20) NOT NULL,
      segmento VARCHAR(255) NOT NULL,
      numero_filiais VARCHAR(100) NOT NULL,
      numero_delivery VARCHAR(30) NOT NULL,
      horario_atendimento VARCHAR(255) NOT NULL,
      responsavel VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      telefone VARCHAR(30) NOT NULL,
      volume_atendimentos VARCHAR(255) NOT NULL,
      canais_atendimento VARCHAR(255) NOT NULL,
      sistemas_integrados VARCHAR(255) NOT NULL,
      objetivos_ia TEXT NOT NULL,
      tom_de_voz TEXT NOT NULL,
      palavras_chave TEXT NOT NULL,
      base_conhecimento TEXT NOT NULL,
      regras_horarios TEXT NOT NULL,
      taxa_entrega VARCHAR(100) NOT NULL,
      valor_isencao_taxa VARCHAR(100) NOT NULL,
      trabalha_genericos VARCHAR(10) NOT NULL,
      programa_preco_popular VARCHAR(10) NOT NULL,
      servicos_drogaria TEXT NOT NULL,
      gatilhos_transferencia_humano TEXT NOT NULL,
      formas_pagamento TEXT NOT NULL,
      modelo_pedido VARCHAR(50) NOT NULL,
      restricoes TEXT,
      observacoes TEXT,
      consentimento_lgpd BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  ```

## Atualizações no roteamento

- Rota `/configuracao-ia` adicionada em `src/app/app.routes.ts` para expor a nova página.

## Fluxo de envio

1. Usuário preenche todos os campos e aceita o consentimento LGPD.
2. Ao submeter, o botão exibe `Enviando informações...` até a resposta da API.
3. Em caso de sucesso, o formulário é resetado e uma mensagem de confirmação aparece.
4. Em falha, uma mensagem orienta o usuário a tentar novamente.

## Próximos passos sugeridos

- Validar com o backend se o endpoint `ia-configuracoes` necessita autenticação, versionamento ou campos extras (ex.: `id_empresa`).
- Avaliar máscaras adicionais (ex.: moeda/percentual) e, se necessário, permitir upload de anexos que alimentem a base de conhecimento.
- Criar migrations no backend usando o script `docs/ia-configuracoes-table.sql` e adicionar testes (unit/E2E) para o fluxo de submissão.
