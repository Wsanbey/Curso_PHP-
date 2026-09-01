// ============================================================
// BANCO DE QUESTÕES - Organizado por categoria
// ============================================================
// Cada questão: { category, categoryLabel, question, options[], correct, explanation, tip }
// tip = ponte pra stack real do usuário
// ============================================================

const CATEGORIES = {
    'php-basico': { name: 'PHP Básico', icon: '🐘', color: '#777BB4' },
    'pdo':        { name: 'PDO / MySQL', icon: '🗄️', color: '#3b82f6' },
    'rest':       { name: 'API REST',   icon: '🌐', color: '#22c55e' },
    'laravel':    { name: 'Laravel',    icon: '🔺', color: '#ef4444' },
    'sql':        { name: 'SQL',        icon: '📊', color: '#f59e0b' },
    'dicas':      { name: 'Dicas Call', icon: '💡', color: '#8b5cf6' }
};

const QUESTIONS = [

    // ============================================================
    // PHP BÁSICO
    // ============================================================
    {
        category: "php-basico",
        question: "Qual a forma correta de declarar uma variável em PHP?",
        options: [
            "$variavel = valor;",
            "var variavel = valor;",
            "let variavel = valor;",
            "variable $variavel = valor;"
        ],
        correct: 0,
        explanation: "Em PHP, variáveis começam sempre com $ e não precisa declarar tipo. A linguagem é dinâmica.",
        tip: "Python: nome = 'João' | PHP: $nome = 'João' — só muda o $"
    },
    {
        category: "php-basico",
        question: "Qual super global contém dados enviados via formulário POST?",
        options: ["$_GET", "$_POST", "$_REQUEST", "$_SERVER"],
        correct: 1,
        explanation: "$_POST contém dados enviados via método POST. Dados ficam no body da request.",
        tip: "Python/Flask: request.form | PHP: $_POST — mesma coisa"
    },
    {
        category: "php-basico",
        question: "Qual a diferença entre include e require?",
        options: [
            "Não existe diferença",
            "require para o script se arquivo não existir, include continua",
            "include é mais rápido",
            "require só funciona com PHP 8"
        ],
        correct: 1,
        explanation: "require gera FATAL ERROR se o arquivo não existir. include gera WARNING mas continua executando.",
        tip: "Use require para arquivos essenciais (config, autoload). Include para opcionais."
    },
    {
        category: "php-basico",
        question: "Como redirecionar o usuário para outra página?",
        options: [
            "redirect('url')",
            "header('Location: url')",
            "navigate('url')",
            "location.href = 'url'"
        ],
        correct: 1,
        explanation: "header('Location: url') é a forma nativa. SEMPRE siga com exit() para parar a execução.",
        tip: "Diferente do Python (return redirect()) — PHP usa header() antes de qualquer output"
    },
    {
        category: "php-basico",
        question: "O que faz json_encode()?",
        options: [
            "Decodifica JSON para array",
            "Converte array/objeto PHP para string JSON",
            "Cria um arquivo JSON",
            "Valida JSON"
        ],
        correct: 1,
        explanation: "json_encode() converte PHP array/objeto para string JSON. json_decode() faz o contrário.",
        tip: "Python: json.dumps() | PHP: json_encode() — mesma função, nome diferente"
    },
    {
        category: "php-basico",
        question: "Como declarar um array associativo em PHP?",
        options: [
            "$arr = [1, 2, 3]",
            "$arr = {'key': 'value'}",
            "$arr = ['key' => 'value']",
            "$arr = array('key': 'value')"
        ],
        correct: 2,
        explanation: "Arrays associativos usam => para ligar chave ao valor. É um dicionário no Python.",
        tip: "Python: {'key': 'value'} | PHP: ['key' => 'value'] — só muda o separador"
    },
    {
        category: "php-basico",
        question: "Qual função lê o body de uma requisição HTTP?",
        options: [
            "file_get_contents('input')",
            "file_get_contents('php://input')",
            "$_SERVER['REQUEST_BODY']",
            "read_body()"
        ],
        correct: 1,
        explanation: "php://input é um wrapper que retorna o body bruto. Essencial para APIs REST.",
        tip: "Python: request.get_json() | PHP: json_decode(file_get_contents('php://input'), true)"
    },
    {
        category: "php-basico",
        question: "O que faz a constante __DIR__?",
        options: [
            "Retorna o diretório do arquivo atual",
            "Retorna o diretório raiz do projeto",
            "Retorna o diretório temporário",
            "Retorna o diretório do PHP"
        ],
        correct: 0,
        explanation: "__DIR__ retorna o diretório do arquivo atual. Útil para require de caminhos relativos.",
        tip: "Python: os.path.dirname(__file__) | PHP: __DIR__ — muito mais simples"
    },
    {
        category: "php-basico",
        question: "Qual a diferença entre == e === em PHP?",
        options: [
            "Não existe diferença",
            "== compara valor, === compara valor E tipo",
            "== é mais rápido",
            "=== só funciona com strings"
        ],
        correct: 1,
        explanation: "== faz coerção de tipo (1 == '1' é true). === verifica tipo E valor (1 === '1' é false).",
        tip: "Use === sempre que possível. É mais seguro e evita bugs silenciosos."
    },
    {
        category: "php-basico",
        question: "O que faz print_r()?",
        options: [
            "Imprime texto formatado",
            "Mostra a representação de um array/objeto para debug",
            "Imprime na tela com formatação HTML",
            "Retorna o tamanho de um array"
        ],
        correct: 1,
        explanation: "print_r() é usado para debug — mostra a estrutura de arrays e objetos. Alternativa: var_dump() mais detalhado.",
        tip: "Python: print(objeto) | PHP: print_r($objeto) ou var_dump($objeto)"
    },

    // ============================================================
    // PDO / MySQL
    // ============================================================
    {
        category: "pdo",
        question: "Por que usar PDO ao invés de mysqli?",
        options: [
            "PDO é mais rápido",
            "PDO suporta múltiplos bancos, mysqli só MySQL",
            "mysqli foi removido no PHP 8",
            "PDO não tem prepared statements"
        ],
        correct: 1,
        explanation: "PDO é genérico — MySQL, PostgreSQL, SQLite, etc. mysqli é exclusivo MySQL. PDO é o padrão.",
        tip: "Como SQLAlchemy no Python — funciona com vários bancos, não só um."
    },
    {
        category: "pdo",
        question: "O que são prepared statements?",
        options: [
            "Queries que o banco salva",
            "Queries compiladas antes de receber os dados, prevenindo SQL Injection",
            "Queries em background",
            "Queries otimizadas com índices"
        ],
        correct: 1,
        explanation: "Separam estrutura da query dos dados. Dados nunca misturam com SQL = impossível SQL Injection.",
        tip: "Python: cursor.execute(query, params) | PHP: $pdo->prepare() + execute()"
    },
    {
        category: "pdo",
        question: "Qual configuração do PDO usa prepared statements REAIS?",
        options: [
            "PDO::ATTR_ERRMODE",
            "PDO::ATTR_EMULATE_PREPARES => false",
            "PDO::ATTR_DEFAULT_FETCH_MODE",
            "PDO::MYSQL_ATTR_FOUND_ROWS"
        ],
        correct: 1,
        explanation: "EMULATE_PREPARES => false usa prepared statements nativos do banco, não simulação do PHP.",
        tip: "Sempre defina false — simulação pode ter falhas de segurança em alguns casos."
    },
    {
        category: "pdo",
        question: "O que PDO::FETCH_ASSOC retorna?",
        options: [
            "Array numérico",
            "Array associativo (chave => valor)",
            "Objeto",
            "String JSON"
        ],
        correct: 1,
        explanation: "FETCH_ASSOC retorna array com chaves sendo nomes das colunas. É o mais usado.",
        tip: "Python: dict(row) | PHP: FETCH_ASSOC — mesma ideia"
    },
    {
        category: "pdo",
        question: "Qual método retorna o último ID inserido?",
        options: [
            "PDO::lastId()",
            "PDO::lastInsertId()",
            "PDO::getLastId()",
            "PDO::insertId()"
        ],
        correct: 1,
        explanation: "lastInsertId() retorna o ID gerado pela última operação INSERT com auto_increment.",
        tip: "Python: cursor.lastrowid | PHP: $pdo->lastInsertId()"
    },
    {
        category: "pdo",
        question: "Para que serve beginTransaction()?",
        options: [
            "Iniciar conexão",
            "Agrupar operações que devem ser confirmadas ou desfeitas juntas",
            "Criar tabela temporária",
            "Fazer backup"
        ],
        correct: 1,
        explanation: "Transação: ou TUDO acontece (commit) ou NADA acontece (rollBack). Essencial em operações financeiras.",
        tip: "Python: connection.begin() | PHP: $pdo->beginTransaction()"
    },
    {
        category: "pdo",
        question: "O que rowCount() retorna?",
        options: [
            "Total de linhas na tabela",
            "Linhas afetadas pela query INSERT/UPDATE/DELETE",
            "Número de colunas",
            "Tamanho da query"
        ],
        correct: 1,
        explanation: "rowCount() retorna quantas linhas foram afetadas. Útil para saber se UPDATE/DELETE funcionou.",
        tip: "Para saber se um registro existe, use rowCount() após a query."
    },
    {
        category: "pdo",
        question: "Qual a forma correta de tratar erros PDO?",
        options: [
            "Verificar se $stmt é false",
            "Usar try/catch com PDOException",
            "Usar if/else com error_code()",
            "PDO não permite tratar erros"
        ],
        correct: 1,
        explanation: "Com ERRMODE_EXCEPTION, PDO lança PDOException. Use try/catch para capturar.",
        tip: "Igual Python: try/except. Nunca mostre erro do PDO pro usuário final."
    },

    // ============================================================
    // API REST
    // ============================================================
    {
        category: "rest",
        question: "Qual método HTTP cria um novo recurso?",
        options: ["GET", "POST", "PUT", "PATCH"],
        correct: 1,
        explanation: "POST cria recursos. GET busca, PUT atualiza completa, PATCH parcial, DELETE remove.",
        tip: "REST é igual em qualquer linguagem — os métodos HTTP são os mesmos."
    },
    {
        category: "rest",
        question: "Qual status code = recurso não encontrado?",
        options: ["200", "400", "404", "500"],
        correct: 2,
        explanation: "404 = Not Found. 200 = OK, 400 = Bad Request, 500 = Internal Server Error.",
        tip: "Memorize: 200 (ok), 201 (criado), 400 (bad request), 404 (não encontrado), 500 (erro interno)"
    },
    {
        category: "rest",
        question: "Qual header indica que a resposta é JSON?",
        options: [
            "Accept: application/json",
            "Content-Type: application/json",
            "X-JSON: true",
            "Response-Type: json"
        ],
        correct: 1,
        explanation: "Content-Type: application/json no response diz ao client que os dados são JSON.",
        tip: "Accept é no REQUEST (o que o client quer). Content-Type é no RESPONSE (o que o server manda)."
    },
    {
        category: "rest",
        question: "Para que serve CORS?",
        options: [
            "Compressão de dados",
            "Autenticação",
            "Permitir requisições de outros domínios",
            "Cache"
        ],
        correct: 2,
        explanation: "CORS permite que um site acesse recursos de outro domínio. Sem isso, o browser bloqueia.",
        tip: "Em desenvolvimento local, sempre precisa configurar CORS. Em produção, depende do setup."
    },
    {
        category: "rest",
        question: "O que retorna http_response_code(201)?",
        options: [
            "Erro de autenticação",
            "Recurso criado com sucesso",
            "Recurso não encontrado",
            "Erro interno"
        ],
        correct: 1,
        explanation: "201 = Created. Usado após POST bem-sucedido que cria um recurso.",
        tip: "201 é para criação. 200 é para operações normais (GET, PUT, DELETE)."
    },
    {
        category: "rest",
        question: "Como ler body de PUT/DELETE em PHP?",
        options: [
            "$_POST",
            "file_get_contents('php://input')",
            "$_SERVER['REQUEST_BODY']",
            "getPutData()"
        ],
        correct: 1,
        explanation: "php://input retorna body bruto. PUT/DELETE não usam formulário HTML, então $_POST não funciona.",
        tip: "Python: request.get_json() | PHP: json_decode(file_get_contents('php://input'), true)"
    },
    {
        category: "rest",
        question: "Qual a diferença entre PUT e PATCH?",
        options: [
            "Não existe diferença",
            "PUT substitui tudo, PATCH atualiza só o que mudou",
            "PATCH é mais seguro",
            "PUT é mais rápido"
        ],
        correct: 1,
        explanation: "PUT = substituição completa (envia tudo). PATCH = atualização parcial (envia só o que mudou).",
        tip: "PUT = 'substitua este usuário inteiro'. PATCH = 'mude só o email deste usuário'."
    },
    {
        category: "rest",
        question: "O que faz OPTIONS em uma API?",
        options: [
            "Lista opções do servidor",
            "Resolve preflight do CORS (verifica métodos permitidos)",
            "Retorna configurações",
            "Atualiza metadados"
        ],
        correct: 1,
        explanation: "OPTIONS é enviado pelo browser antes de requests complexos para verificar se o servidor permite.",
        tip: "Você não precisa criar endpoint OPTIONS — o framework/servidor lida automaticamente."
    },

    // ============================================================
    // LARAVEL
    // ============================================================
    {
        category: "laravel",
        question: "O que é Laravel?",
        options: [
            "Um banco de dados",
            "Framework MVC para PHP",
            "Uma IDE",
            "Um servidor web"
        ],
        correct: 1,
        explanation: "Laravel é o framework PHP mais popular. Padrão MVC, como Django no Python.",
        tip: "Se você já usou Django, Flask ou Express.js, o conceito é o mesmo."
    },
    {
        category: "laravel",
        question: "O que é Blade no Laravel?",
        options: [
            "Sistema de autenticação",
            "Engine de templates para views HTML",
            "ORM para banco",
            "CLI"
        ],
        correct: 1,
        explanation: "Blade é engine de templates. Similar ao Jinja2 no Python. Usa {{ }} e @if, @foreach.",
        tip: "Python/Jinja2: {{ user.name }} | Laravel/Blade: {{ $user->name }}"
    },
    {
        category: "laravel",
        question: "O que uma Migration faz?",
        options: [
            "Migra dados entre bancos",
            "Versiona a estrutura do banco de dados",
            "Faz backup",
            "Otimiza queries"
        ],
        correct: 1,
        explanation: "Migrations são arquivos que definem estrutura do banco. Permite reverter e trabalhar em equipe.",
        tip: "Python: Alembic | Laravel: php artisan make:migration create_users_table"
    },
    {
        category: "laravel",
        question: "O que é Artisan?",
        options: [
            "Plugin de performance",
            "CLI do Laravel para comandos",
            "Sistema de cache",
            "ORM"
        ],
        correct: 1,
        explanation: "Artisan é o terminal do Laravel. Cria models, controllers, migrations automaticamente.",
        tip: "Python: python manage.py | PHP: php artisan — mesma coisa"
    },
    {
        category: "laravel",
        question: "Como definir uma rota no Laravel?",
        options: [
            "define('/rota', 'controller')",
            "Route::get('/rota', [Controller::class, 'method'])",
            "app.get('/rota', controller)",
            "$routes->add('/rota')"
        ],
        correct: 1,
        explanation: "Rotas usam facade Route. Métodos: get, post, put, delete. Aponta para controller + método.",
        tip: "Flask: @app.route('/users') | Laravel: Route::get('/users', [UserController::class, 'index'])"
    },
    {
        category: "laravel",
        question: "O que é Eloquent?",
        options: [
            "Uma view HTML",
            "ORM que representa tabelas como classes PHP",
            "Configuração",
            "Middleware"
        ],
        correct: 1,
        explanation: "Eloquent é o ORM. Cada model = uma tabela. User::all() busca todos, como SQLAlchemy.",
        tip: "Python: User.query.all() | Laravel: User::all() — Eloquent é mais enxuto"
    },

    // ============================================================
    // SQL
    // ============================================================
    {
        category: "sql",
        question: "Qual JOIN retorna todos da esquerda sem correspondência?",
        options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN"],
        correct: 1,
        explanation: "LEFT JOIN: todos da esquerda + correspondentes da direita. Sem correspondência = NULL.",
        tip: "LEFT JOIN = 'quero TODOS os usuários, mesmo os que não têm pedidos'"
    },
    {
        category: "sql",
        question: "Qual a diferença entre WHERE e HAVING?",
        options: [
            "Não existe diferença",
            "WHERE filtra antes do GROUP BY, HAVING filtra depois",
            "HAVING é mais rápido",
            "WHERE só funciona com JOIN"
        ],
        correct: 1,
        explanation: "WHERE = filtra linhas individuais. HAVING = filtra após agrupamento (GROUP BY).",
        tip: "WHEREcity = 'SP' | HAVING COUNT(*) > 5"
    },
    {
        category: "sql",
        question: "Para que serve GROUP BY?",
        options: [
            "Ordenar",
            "Agrupar linhas com valores iguais",
            "Filtrar",
            "Juntar tabelas"
        ],
        correct: 1,
        explanation: "GROUP BY agrupa por coluna. Usado com COUNT, SUM, AVG para calcular totais.",
        tip: "SELECT city, COUNT(*) FROM users GROUP BY city — conta usuários por cidade"
    },
    {
        category: "sql",
        question: "O que faz uma subquery?",
        options: [
            "Cria tabela temporária",
            "Executa query dentro de outra query",
            "Otimiza performance",
            "Cria índices"
        ],
        correct: 1,
        explanation: "Subquery = query aninhada. SELECT * FROM users WHERE id IN (SELECT user_id FROM orders).",
        tip: "Funciona mas pode ser lento. Às vezes um JOIN é melhor que subquery."
    },
    {
        category: "sql",
        question: "Para que serve CREATE INDEX?",
        options: [
            "Criar tabela",
            "Acelerar buscas em colunas específicas",
            "Criar view",
            "Criar constraint"
        ],
        correct: 1,
        explanation: "Índices aceleram SELECT/WHERE. Trocam espaço em disco por performance de leitura.",
        tip: "SEMPRE indexe colunas usadas em WHERE, JOIN e ORDER BY."
    },
    {
        category: "sql",
        question: "O que faz DISTINCT?",
        options: [
            "Ordena",
            "Remove linhas duplicadas",
            "Conta linhas",
            "Filtra nulos"
        ],
        correct: 1,
        explanation: "DISTINCT remove duplicatas. SELECT DISTINCT city FROM users retorna cidades únicas.",
        tip: "Cuidado: DISTINCT é lento em tabelas grandes. Índices ajudam."
    },

    // ============================================================
    // DICAS DA CALL
    // ============================================================
    {
        category: "dicas",
        question: "Melhor resposta para 'O que você sabe de PHP'?",
        options: [
            "Não sei nada, tô aprendendo",
            "Sei tudo, já fiz vários projetos",
            "Tenho base sólida com PDO, APIs REST e estou estudando Laravel",
            "PHP é fácil, qualquer coisa eu vi no YouTube"
        ],
        correct: 2,
        explanation: "Mostre confiança sem exagerar. Dê exemplos concretos e demonstre que está evoluindo.",
        tip: "Conecte com sua stack: 'Trabalho com Python, mas PHP é similar. PDO = SQLAlchemy'"
    },
    {
        category: "dicas",
        question: "Melhor resposta para 'O que é SQL Injection'?",
        options: [
            "É quando o banco trava",
            "Ataque que insere código malicioso em queries SQL",
            "É quando esquece a senha",
            "É um tipo de vírus"
        ],
        correct: 1,
        explanation: "Vulnerabilidade onde atacante insere SQL malicioso em inputs. Prevenção: prepared statements.",
        tip: "Dê um exemplo: 'Se o input for \"1 OR 1=1\", sem prepared statement deleta tudo'"
    },
    {
        category: "dicas",
        question: "Como demonstrar interesse pela vaga?",
        options: [
            "Não falar nada",
            "Perguntar sobre stack e como contribuir",
            "Falar que quer ganhar mais",
            "Dizer que aceita qualquer coisa"
        ],
        correct: 1,
        explanation: "Pergunte sobre tecnologias, processos, time. Mostra curiosidade e profissionalismo.",
        tip: "Pergunte: 'Qual stack vocês usam?' 'Como é o processo de deploy?' 'O time é grande?'"
    },
    {
        category: "dicas",
        question: "Se errar uma pergunta, o que fazer?",
        options: [
            "Mentir",
            "Não responder nada",
            "Ser honesto + mostrar capacidade de aprender",
            "Desligar"
        ],
        correct: 2,
        explanation: "Honestidade com confiança. 'Não tenho certeza, mas como já fiz X, acredito que consigo aprender.'",
        tip: "Ninguém sabe tudo. O que importa é mostrar que aprende rápido e é proativo."
    }
];
