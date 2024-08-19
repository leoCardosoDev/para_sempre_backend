### 1. **Tarefa 1: Criar Convite**

**Título**: Como Administrador, eu quero criar um convite único para um aluno, para que ele possa acessar a página de signup e criar uma conta.

**Critérios de Aceitação**:
1. O sistema deve permitir que o administrador gere um código único de convite.
2. O código de convite deve ser armazenado no banco de dados com status "ativo".
3. O código de convite deve estar vinculado a uma data de criação.
4. O administrador deve poder inserir o e-mail do aluno que receberá o convite.

**Notas**:
- O código do convite deve ser seguro e difícil de adivinhar.
- O administrador deve ter a capacidade de visualizar os convites criados e seus status.

### 2. **Tarefa 2: Enviar Convite**
**Título**: Como Administrador, eu quero enviar um convite para um aluno, para que ele possa utilizar o código para acessar a página de signup e criar uma conta.

**Critérios de Aceitação**:
1. O sistema deve permitir o envio automático de um e-mail ao aluno com o código de convite e um link para a página de signup.
2. O e-mail deve incluir instruções claras sobre como utilizar o convite.
3. O convite deve ser válido para um único uso, e o status deve ser atualizado para "usado" assim que o aluno criar uma conta com sucesso.

**Notas**:
- O sistema deve notificar o administrador sobre o status do envio.
- O e-mail enviado deve ser seguro e seguir as melhores práticas de segurança para evitar o uso indevido do convite.

Essas tarefas ajudam a focar em cada parte do processo de criação e envio do convite, garantindo que ambos os aspectos sejam desenvolvidos e testados de forma eficiente.
