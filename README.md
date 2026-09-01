# PHP Interview Prep

Plataforma de estudos interativa para preparação de entrevistas técnicas PHP.

**Acesse:** [curso-php.pages.dev](https://curso-php.pages.dev/)

![PHP Interview Prep](https://img.shields.io/badge/PHP-Interview%20Prep-777BB4?style=for-the-badge&logo=php&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## Funcionalidades

### Quiz Interativo
- 40+ questões categorizadas com explicações
- Filtro por matéria: PHP, PDO/MySQL, API REST, Laravel, SQL, Dicas
- Configuração de limite de questões (5 a 30+)
- Ordem aleatória ou sequencial
- Feedback visual imediato (correto/incorreto)
- Explicação detalhada + ponte com Python/JavaScript

### Conteúdo de Estudo
- Teoria organizada por tópico
- Código exemplicativo com syntax highlighting
- Dicas práticas para a entrevista
- Conexão com outras linguagens (Python, JS)

### Acompanhamento de Progresso
- Dashboard com estatísticas gerais
- Histórico completo de tentativas
- Média de acertos, melhor pontuação
- Retomar quiz de onde parou
- Progresso salvo localmente (localStorage)

### Design Profissional
- Layout responsivo (desktop + mobile)
- Interface moderna e limpa
- Navegação intuitiva
- Animações discretas e profissionais
- Acessibilidade (contraste, foco, teclado)

---

## Como Usar

1. Acesse [curso-php.pages.dev](https://curso-php.pages.dev/)
2. Na aba **Dashboard**, veja seu progresso
3. Configure e inicie um novo quiz
4. Estude o conteúdo na aba **Estudar**
5. Acompanhe sua evolução no **Histórico**

---

## Deploy

### GitHub Pages
1. Push no repositório
2. Settings → Pages → Source: main branch
3. Acesse via `https://wsanbey.github.io/Curso_PHP-/`

### Cloudflare Pages
1. Conecte o repositório GitHub
2. Build command: (nenhum — é HTML puro)
3. Output directory: `/`
4. Deploy automático a cada push

---

## Estrutura do Projeto

```
├── index.html          # HTML principal
├── style.css           # Estilos (design system)
├── data.js             # Banco de questões
├── study.js            # Conteúdo de estudo
├── app.js              # Lógica da aplicação
├── php_cheat.php       # Cheat sheet PHP (referência)
├── .gitignore          # Arquivos ignorados
└── README.md           # Este arquivo
```

---

## Roadmap — Melhorias Futuras

### IA Integrada (v2.0)
O sistema será integrado com inteligência artificial para oferecer uma experiência de estudo personalizada:

- **Chat com IA**: Tire dúvidas em tempo real sobre qualquer tópico PHP
- **Geração de questões**: IA cria questões personalizadas baseadas no seu nível
- **Explicações sob medida**: Respostas adaptadas ao seu perfil de aprendizado
- **Análise de desempenho**: IA identifica seus pontos fracos e sugere estudos

### Provedores de IA (Escolha do Usuário)
O usuário poderá escolher seu próprio provedor de IA:

- **OpenAI** (GPT-4, GPT-3.5)
- **Anthropic** (Claude)
- **Google** (Gemini)
- **Groq** (LLaMA, Mixtral — gratuito)
- **Ollama** (local — 100% gratuito)
- **Chave personalizada** (API key própria)

Cada provedor terá configuração de:
- API Key (salva localmente, nunca no servidor)
- Modelo preferido
- Limite de tokens por mensagem
- Custo estimado por uso

### Gamificação (v2.1)
- Sistema de XP e níveis
- Conquistas e badges
- Ranking semanal
- Sequências de estudo (streaks)
- Desafios diários

### Comunidade (v2.2)
- Compartilhar resultados
- Quiz competitivo (multiplayer)
- Fórum de dúvidas
- Listas de estudo compartilhadas

### Apps Nativos (v3.0)
- PWA (Progressive Web App)
- Notificações de estudo
- Modo offline completo
- Sincronização entre dispositivos

---

## Stack Técnica

| Tecnologia | Uso |
|------------|-----|
| HTML5 | Estrutura semântica |
| CSS3 | Design system com variáveis |
| JavaScript | Lógica completa (zero dependências) |
| localStorage | Persistência local |
| Lucide Icons | Ícones consistentes |
| Inter | Tipografia moderna |

---

## Contribuição

Contribuições são bem-vindas! Abra uma issue ou PR.

---

## Licença

MIT

---

Desenvolvido com dedicação para ajudar desenvolvedores PHP a conquistar suas vagas.
