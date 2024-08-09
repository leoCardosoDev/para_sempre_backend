module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Limita o tamanho do título do commit a 100 caracteres
    'header-max-length': [2, 'always', 100],
    // Limita o tamanho do corpo do commit a 72 caracteres por linha
    'body-max-line-length': [2, 'always', 72],
    // Limita o tamanho da linha do footer do commit a 72 caracteres
    'footer-max-line-length': [2, 'always', 72],
    // Define o formato do commit para seguir o Conventional Commits
    'type-enum': [
      2,
      'always',
      [
        'feat',    // A new feature for the user
        'fix',     // A bug fix for the user
        'docs',    // Changes to the documentation
        'style',   // Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc.)
        'refactor',// A code change that neither fixes a bug nor adds a feature
        'perf',    // A code change that improves performance
        'test',    // Adding missing tests or correcting existing tests
        'chore',   // Changes to the build process or auxiliary tools and libraries such as documentation generation
        'revert'   // Reverts a previous commit
      ]
    ],
    // Força uma mensagem de commit a seguir o formato <type>(<scope>): <subject>
    'header-min-length': [2, 'always', 5]
  }
};
