// ============================================================
// CONTEÚDO DE ESTUDO - Por Categoria
// ============================================================

const STUDY_CONTENT = {

    'php-basico': {
        icon: '🐘',
        title: 'PHP Básico',
        sections: [
            {
                title: 'Variáveis e Tipos',
                code: `// Variáveis começam com $ e são dinâmicas
$nome = "João";        // string
$idade = 25;           // integer
$preco = 19.99;        // float
$ativo = true;         // boolean
$vazio = null;

// Verificar tipo
gettype($nome);        // "string"
is_int($idade);        // true
is_string($nome);      // true

// Conversão
$numero = (int) "42";  // 42
$texto = (string) 100; // "100"`,
                note: "PHP é dinâmica como Python. Não precisa declarar tipo. A diferença visual é o $."
            },
            {
                title: 'Arrays',
                code: `// Array indexado
$lista = [1, 2, 3, 4, 5];
echo $lista[0]; // 1

// Array associativo (dicionário)
$pessoa = [
    "nome" => "João",
    "idade" => 25,
    "email" => "joao@email.com"
];
echo $pessoa["nome"]; // "João"

// Funções úteis
count($lista);          // 5
array_push($lista, 6); // adiciona no final
in_array(3, $lista);   // true
array_keys($pessoa);   // ["nome", "idade", "email"]`,
                note: "Array associativo = dicionário Python. Chave => valor."
            },
            {
                title: 'Loops e Funções',
                code: `// foreach (o mais usado)
foreach ($lista as $item) {
    echo $item;
}

foreach ($pessoa as $chave => $valor) {
    echo "$chave: $valor";
}

// for e while
for ($i = 0; $i < 10; $i++) { echo $i; }
while ($condicao) { /* ... */ }

// Funções
function saudar(string $nome): string {
    return "Olá, $nome!";
}

// Arrow function (PHP 7.4+)
$somar = fn($a, $b) => $a + $b;
echo $somar(2, 3); // 5`,
                note: "foreach é o loop mais usado em PHP. Funções aceitam type hints."
            },
            {
                title: 'Super Globals',
                code: `// Dados de formulário
$_GET['param'];       // URL ?param=valor
$_POST['campo'];      // Formulário POST
$_REQUEST['campo'];   // GET + POST

// Sessão
session_start();
$_SESSION['user'] = "João";
$_SESSION['logged'] = true;

// Servidor
$_SERVER['REQUEST_METHOD'];  // GET, POST, etc.
$_SERVER['HTTP_HOST'];       // domínio
$_SERVER['REQUEST_URI'];     // /caminho`,
                note: "Super globals existem em todo escopo. Não precisa declarar."
            }
        ]
    },

    'pdo': {
        icon: '🗄️',
        title: 'PDO / MySQL',
        sections: [
            {
                title: 'Conexão PDO',
                code: `try {
    $pdo = new PDO(
        "mysql:host=127.0.0.1;dbname=teste;charset=utf8mb4",
        "user",
        "pass",
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]
    );
} catch (PDOException $e) {
    error_log("Erro: " . $e->getMessage());
    echo "Erro de conexão";
    exit;
}`,
                note: "ERRMODE_EXCEPTION = lança exceções. EMULATE_PREPARES false = segurança real."
            },
            {
                title: 'CRUD Completo',
                code: `// INSERT
$stmt = $pdo->prepare("INSERT INTO users (name, email) VALUES (:name, :email)");
$stmt->execute([":name" => "João", ":email" => "joao@email.com"]);
$id = $pdo->lastInsertId();

// SELECT 1 registro
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = :id");
$stmt->execute([":id" => $id]);
$user = $stmt->fetch();

// SELECT vários
$stmt = $pdo->query("SELECT * FROM users");
$users = $stmt->fetchAll();

// UPDATE
$stmt = $pdo->prepare("UPDATE users SET name = :name WHERE id = :id");
$stmt->execute([":name" => "Novo", ":id" => $id]);

// DELETE
$stmt = $pdo->prepare("DELETE FROM users WHERE id = :id");
$stmt->execute([":id" => $id]);`,
                note: "SEMPRE use prepared statements. Nunca concatene variáveis na query."
            },
            {
                title: 'Transações',
                code: `try {
    $pdo->beginTransaction();

    // Operação 1: Debitar
    $pdo->exec("UPDATE contas SET saldo = saldo - 100 WHERE id = 1");

    // Operação 2: Creditar
    $pdo->exec("UPDATE contas SET saldo = saldo + 100 WHERE id = 2");

    $pdo->commit(); // Confirma TUDO
} catch (PDOException $e) {
    $pdo->rollBack(); // Desfaz TUDO
    throw $e;
}`,
                note: "Transação = ou TUDO ou NADA. Essencial em operações financeiras."
            }
        ]
    },

    'rest': {
        icon: '🌐',
        title: 'API REST',
        sections: [
            {
                title: 'Estrutura Básica',
                code: `// Headers
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

// Resolver preflight CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Ler método e dados
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);`,
                note: "php://input = body bruto da request. Essencial para PUT/DELETE."
            },
            {
                title: 'Status Codes Essenciais',
                code: `// Sucesso
http_response_code(200); // OK
http_response_code(201); // Created (após POST)

// Erro do Cliente
http_response_code(400); // Bad Request
http_response_code(401); // Unauthorized
http_response_code(404); // Not Found
http_response_code(405); // Method Not Allowed

// Erro do Servidor
http_response_code(500); // Internal Server Error

// Resposta padronizada
function responder($dados, $status = 200) {
    http_response_code($status);
    header("Content-Type: application/json");
    echo json_encode($dados, JSON_UNESCAPED_UNICODE);
    exit;
}`,
                note: "Memorize: 200 (ok), 201 (criado), 400 (bad), 404 (não existe), 500 (erro)"
            },
            {
                title: 'Router Simples',
                code: `$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$parts = explode('/', trim($path, '/'));

switch ($method) {
    case 'GET':
        // GET /users ou GET /users/123
        if (isset($parts[2])) {
            // Buscar 1
            $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
            $stmt->execute([$parts[2]]);
            responder($stmt->fetch());
        } else {
            // Listar todos
            responder($pdo->query("SELECT * FROM users")->fetchAll());
        }
        break;

    case 'POST':
        $stmt = $pdo->prepare("INSERT INTO users (name, email) VALUES (?, ?)");
        $stmt->execute([$input['name'], $input['email']]);
        responder(["id" => $pdo->lastInsertId()], 201);
        break;
}`,
                note: "Em produção, use um framework (Laravel, Slim) — router manual é didático."
            }
        ]
    },

    'laravel': {
        icon: '🔺',
        title: 'Laravel',
        sections: [
            {
                title: 'Roteamento',
                code: `// Rotas básicas
Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
Route::get('/users/{id}', [UserController::class, 'show']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);

// Rotas com middleware
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashController::class, 'index']);
});

// Rota de resource (cria todas automaticamente)
Route::resource('users', UserController::class);`,
                note: "Route::resource cria GET, POST, PUT, DELETE de uma vez."
            },
            {
                title: 'Controllers e Models',
                code: `// Controller
class UserController extends Controller {
    public function index() {
        return response()->json(User::all());
    }

    public function store(Request $request) {
        $user = User::create($request->validated());
        return response()->json($user, 201);
    }

    public function show($id) {
        return response()->json(User::findOrFail($id));
    }
}

// Model
class User extends Model {
    protected $fillable = ['name', 'email'];
    protected $hidden = ['password'];
}`,
                note: "Eloquent ORM: User::all() = SELECT * FROM users. Much simpler than raw SQL."
            },
            {
                title: 'Migrations e Artisan',
                code: `// Criar migration
php artisan make:model User -m

// Migration
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->string('password');
    $table->timestamps(); // created_at, updated_at
});

// Rodar migrations
php artisan migrate

// Reverter
php artisan migrate:rollback

// Outros comandos úteis
php artisan make:controller PostController
php artisan make:middleware CheckAge
php artisan serve`,
                note: "Artisan = manage.py no Django. Cria arquivos automaticamente."
            },
            {
                title: 'Blade Templates',
                code: `{{-- Variáveis --}}
<h1>{{ $user->name }}</h1>

{{-- Condições --}}
@if($user->active)
    <span>Ativo</span>
@else
    <span>Inativo</span>
@endif

{{-- Loops --}}
@foreach($users as $user)
    <p>{{ $user->name }}</p>
@endforeach

{{-- Layout --}}
@extends('layouts.app')
@section('content')
    <h1>Dashboard</h1>
@endsection`,
                note: "Blade = Jinja2 no Python. {{ }} para variáveis, @ para diretivas."
            }
        ]
    },

    'sql': {
        icon: '📊',
        title: 'SQL',
        sections: [
            {
                title: 'JOINs',
                code: `-- INNER JOIN: só correspondentes
SELECT u.name, o.total
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- LEFT JOIN: todos da esquerda
SELECT u.name, COUNT(o.id) as total
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id;

-- RIGHT JOIN: todos da direita
SELECT u.name, o.total
FROM users u
RIGHT JOIN orders o ON u.id = o.user_id;`,
                note: "LEFT JOIN = 'quero TODOS os usuários, mesmo sem pedidos'"
            },
            {
                title: 'GROUP BY e HAVING',
                code: `-- Contar por cidade
SELECT city, COUNT(*) as total
FROM users
GROUP BY city;

-- Filtrar após agrupar
SELECT city, COUNT(*) as total
FROM users
GROUP BY city
HAVING COUNT(*) > 5;

-- Média por categoria
SELECT category, AVG(price) as media
FROM products
GROUP BY category
HAVING AVG(price) > 100;`,
                note: "WHERE = filtra antes do GROUP BY. HAVING = filtra depois."
            },
            {
                title: 'Subqueries e Índices',
                code: `-- Subquery
SELECT * FROM users WHERE id IN (
    SELECT user_id FROM orders WHERE total > 100
);

-- EXISTS (mais rápido que IN para muitos dados)
SELECT * FROM users u
WHERE EXISTS (
    SELECT 1 FROM orders o WHERE o.user_id = u.id
);

-- Criar índice
CREATE INDEX idx_users_email ON users(email);

-- Composite index
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);`,
                note: "Índices = mais leitura, menos espaço. SEMPRE indexe colunas de WHERE/JOIN."
            }
        ]
    },

    'dicas': {
        icon: '💡',
        title: 'Dicas para a Entrevista',
        sections: [
            {
                title: 'Frase de Abertura',
                code: `"Minha stack principal é Python e JavaScript, mas tenho
experiência com PHP através de scripts e APIs REST.
Trabalho com SQL diariamente e tenho base sólida em PDO.
Estou estudando Laravel pra complementar e tenho
facilidade com novas tecnologias porque já atuo com
automação (n8n) e suporte técnico."`,
                note: "Conecte sua stack real com PHP. Mostre que não é zero."
            },
            {
                title: 'O que NÃO dizer',
                code: `❌ "Não sei nada de PHP"
❌ "Só uso Python"
❌ "Framework é tranquilo" (vago demais)
❌ "Não sei o que é PDO"
❌ "Testes? Nunca fiz"
❌ "Deploy? Não manjo"
❌ "Não me pergunte sobre SQL"

✅ "Tenho base com PDO e APIs"
✅ "SQL é minha força, uso diariamente"
✅ "Laravel estou estudando, é similar ao Django"
✅ "Já trabalhei com GLPI e AD em suporte"
✅ "Se a empresa me apoiar, eu evoluo rápido"`,
                note: "Nunca diga que não sabe nada. Sempre mostre o que JÁ SABE."
            },
            {
                title: 'Perguntas para fazer ao entrevistador',
                code: `"Qual stack vocês usam atualmente?"
"Como é o processo de deploy?"
"O time de desenvolvimento é grande?"
"Trabalham com versionamento (Git)?"
"Como é a integração com o suporte técnico?"

-- Isso mostra interesse genuíno e profissionalismo.`,
                note: "Fazer perguntas é tão importante quanto responder bem."
            }
        ]
    }
};
