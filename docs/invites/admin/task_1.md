### **Tarefa 1: Criar Convite**

**Título**: Como Administrador, eu quero criar um convite único para um aluno, para que ele possa acessar a página de signup e criar uma conta.

#### **Caso de Sucesso**
1. **Requisição**: O sistema deve receber uma requisição do tipo **POST** na rota **/api/invites**.
2. **Autorização**: O sistema deve validar se a requisição foi feita por um usuário com permissões de administrador.
3. **Validação de Dados**:
   - O sistema deve validar se todos os dados obrigatórios foram fornecidos na requisição, incluindo:
     - Endereço de e-mail do aluno.
     - Qualquer outra informação necessária para a criação do convite.
4. **Geração do Convite**:
   - O sistema deve gerar um código único e seguro para o convite.
   - O convite deve ser armazenado no banco de dados com o status "ativo".
   - O sistema deve registrar a data de criação do convite.
   - O convite deve ser vinculado ao endereço de e-mail fornecido.
5. **Resposta**: O sistema deve retornar uma resposta **204 No Content** para indicar que o convite foi criado com sucesso, sem necessidade de enviar dados adicionais.

#### **Exceções**
1. **API Inexistente**: O sistema deve retornar um erro **404 Not Found** se a rota **/api/invites** não existir.
2. **Autorização Falha**: O sistema deve retornar um erro **403 Forbidden** se o usuário que fez a requisição não tiver permissões de administrador.
3. **Validação de Dados Falha**: O sistema deve retornar um erro **400 Bad Request** se os dados obrigatórios não forem fornecidos ou se forem inválidos.
4. **Erro Interno**: O sistema deve retornar um erro **500 Internal Server Error** se ocorrer um erro ao tentar criar o convite no banco de dados ou ao gerar o código.

#### **Notas Adicionais**
- **Segurança do Código**: O código gerado para o convite deve ser suficientemente complexo para evitar ataques de força bruta.
- **Registro e Auditoria**: O sistema deve registrar a criação do convite e quem foi o administrador responsável, para fins de auditoria e monitoramento.
- **Visualização de Convites**: O administrador deve poder acessar uma lista de convites criados, junto com seus status e data de criação, para acompanhamento.

Essa estrutura detalhada abrange as necessidades tanto do ponto de vista funcional quanto de segurança e usabilidade. Ela também garante que as exceções sejam tratadas adequadamente, proporcionando uma experiência robusta para o administrador.
