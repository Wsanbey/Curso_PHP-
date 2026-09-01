# PHP Interview Prep

Sistema de estudo interativo para preparação de entrevistas técnicas PHP.

## Funcionalidades

- **Quiz interativo** com 40+ questões categorizadas
- **Filtro por matéria**: PHP, PDO/MySQL, API REST, Laravel, SQL, Dicas
- **Limite de questões**: 5, 10, 15, 20, 30 ou todas
- **Conteúdo de estudo** com código e explicações
- **Histórico de tentativas** com acompanhamento de evolução
- **Retomar quiz** de onde parou
- **Design responsivo** (funciona no celular e PC)
- **Ponte com Python/JavaScript** em cada questão

## Como Usar

1. Abra `index.html` no navegador
2. Selecione as categorias e configure o quiz
3. Estude o conteúdo na aba "Estudo"
4. Responda as questões e acompanhe o progresso

## Tecnologias

- HTML5
- CSS3 (variáveis CSS, flexbox, grid)
- JavaScript puro (sem dependências)
- localStorage para persistência

## Estrutura

```
├── index.html      # HTML principal
├── style.css       # Estilos
├── data.js         # Banco de questões
├── study.js        # Conteúdo de estudo
├── app.js          # Lógica da aplicação
└── php_cheat.php   # Cheat sheet PHP (referência)
```

## Deploy

### GitHub Pages
1. Push no repositório
2. Settings → Pages → Source: main
3. Acesse via `https://username.github.io/repo/`

### Cloudflare Pages
1. Conecte o repositório GitHub
2. Build: nenhum (é HTML puro)
3. Output: `/` (raiz)

## Licença

MIT
