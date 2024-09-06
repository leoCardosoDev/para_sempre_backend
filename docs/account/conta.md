# Fluxo de Criação de Conta com Convite

## 1. Verificação do Convite

### Cenário: Verificar Existência e Status do Convite

- **Dado** que o código do convite foi fornecido
- **Quando** o sistema verifica a existência do convite
- **Então** o sistema deve verificar se o código do convite existe no banco de dados
- **E** o sistema deve confirmar se o status do convite é `'active'`
- **E** se o status for `'used'`, o sistema deve retornar um erro informando que o convite já foi utilizado

## 2. Verificação do Email

### Cenário: Verificar Correspondência do Email

- **Dado** que o convite é válido
- **E** que o email fornecido para criação da conta é conhecido
- **Quando** o sistema verifica o email associado ao convite
- **Então** o sistema deve garantir que o email fornecido na criação da conta corresponde ao email associado ao convite

## 3. Processo de Criação da Conta

### Cenário: Criar Conta e Associar o Convite

- **Dado** que o convite é válido e o email corresponde ao email associado
- **Quando** o sistema cria a conta com os detalhes fornecidos (nome, email, etc.)
- **Então** o sistema deve salvar o ID do convite na nova conta
- **E** a tabela de usuários deve ser atualizada para incluir o ID do convite associado

## 4. Atualizar o Convite

### Cenário: Atualizar Status do Convite

- **Dado** que a conta foi criada com sucesso
- **Quando** o sistema atualiza o status do convite
- **Então** o sistema deve alterar o status do convite para `'used'`
- **E** o sistema deve salvar as alterações no banco de dados

## 5. Tratamento de Erros

### Cenário: Erros de Validação e Atualização

- **Dado** que uma etapa falhou durante o processo
- **Quando** o sistema detecta uma falha
- **Então** o sistema deve retornar erros apropriados:
  - Se o convite não existir
  - Se o status do convite não for `'active'`
  - Se o email não corresponder
- **E** o sistema deve garantir que quaisquer falhas ao salvar alterações sejam tratadas adequadamente
