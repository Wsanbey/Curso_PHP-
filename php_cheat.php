<?php
/**
 * ============================================================
 * PHP CHEAT SHEET - ENTREVISTA TÉCNICA
 * Stack: PDO + MySQL + API REST + Laravel ( conceitos)
 * ============================================================
 * Use como cola durante a call. Cada seção é autoexplicativa.
 * ============================================================
 */

// ============================================================
// 1. PDO - CONEXÃO ROBUSTA COM MySQL
// ============================================================
// Por que PDO? Suporta múltiplos bancos, tem prepared statements nativos
// e tratamento de erros profissional. É o padrão do mercado.

try {
    $pdo = new PDO(
        "mysql:host=127.0.0.1;dbname=teste;charset=utf8mb4",
        "user",
        "pass",
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,  // Lança exceções em erros
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,        // Retorna arrays associativos
            PDO::ATTR_EMULATE_PREPARES   => false,                   // Usa prepared statements reais (mais seguro)
        ]
    );
} catch (PDOException $e) {
    // Em produção: log + mensagem genérica pro usuário
    error_log("Erro de conexão: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["erro" => "Erro de conexão com banco de dados"]);
    exit;
}

// ============================================================
// 2. CRUD COMPLETO - Prepared Statements
// ============================================================
// Prepared statements previnem SQL Injection (obrigatório em produção)

// --- INSERT ---
$stmt = $pdo->prepare("INSERT INTO users (name, email) VALUES (:name, :email)");
$stmt->execute([
    ":name"  => "Nome Exemplo",
    ":email" => "exemplo@email.com",
]);
$novoId = $pdo->lastInsertId(); // ID do registro inserido

// --- SELECT (buscar 1 registro) ---
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = :id");
$stmt->execute([":id" => $novoId]);
$usuario = $stmt->fetch(); // 1 registro

// --- SELECT (buscar vários registros) ---
$stmt = $pdo->prepare("SELECT * FROM users WHERE active = :active");
$stmt->execute([":active" => 1]);
$usuarios = $stmt->fetchAll(); // array de registros

// --- UPDATE ---
$stmt = $pdo->prepare("UPDATE users SET name = :name WHERE id = :id");
$stmt->execute([":name" => "Nome Atualizado", ":id" => $novoId]);
$linhasAfetadas = $stmt->rowCount(); // quantas linhas foram alteradas

// --- DELETE ---
$stmt = $pdo->prepare("DELETE FROM users WHERE id = :id");
$stmt->execute([":id" => $novoId]);

// ============================================================
// 3. TRY/CATCH COM TRANSAÇÃO
// ============================================================
// Transação garante que ou TUDO acontece, ou NADA acontece
// Exemplo: transferência bancária (débito + crédito = ambos ou nenhum)

try {
    $pdo->beginTransaction();

    // Operação 1: Debitar da conta A
    $pdo->exec("UPDATE contas SET saldo = saldo - 100 WHERE id = 1");

    // Operação 2: Creditar na conta B
    $pdo->exec("UPDATE contas SET saldo = saldo + 100 WHERE id = 2");

    $pdo->commit(); // Confirma tudo
} catch (PDOException $e) {
    $pdo->rollBack(); // Desfaz TUDO em caso de erro
    error_log("Erro na transação: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["erro" => "Falha na operação. Tente novamente."]);
    exit;
}

// ============================================================
// 4. API REST COMPLETA
// ============================================================
// Estrutura básica de uma API em PHP puro
// Headers importantes: Content-Type, CORS

// Headers de resposta
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Resolver preflight do CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Ler método HTTP e dados de entrada
$method  = $_SERVER['REQUEST_METHOD'];
$input   = json_decode(file_get_contents('php://input'), true);
$path    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$parts   = explode('/', trim($path, '/'));
$recurso = $parts[1] ?? ''; // ex: "users"

// Router simples
switch ($method) {

    // GET /users ou GET /users/123
    case 'GET':
        if (isset($parts[2])) {
            // Buscar 1 usuário específico
            $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
            $stmt->execute([$parts[2]]);
            $user = $stmt->fetch();
            if ($user) {
                echo json_encode($user);
            } else {
                http_response_code(404);
                echo json_encode(["erro" => "Usuário não encontrado"]);
            }
        } else {
            // Listar todos
            $stmt = $pdo->query("SELECT * FROM users");
            $users = $stmt->fetchAll();
            echo json_encode($users);
        }
        break;

    // POST /users
    case 'POST':
        if (empty($input['name']) || empty($input['email'])) {
            http_response_code(400);
            echo json_encode(["erro" => "Nome e email são obrigatórios"]);
            break;
        }
        $stmt = $pdo->prepare("INSERT INTO users (name, email) VALUES (?, ?)");
        $stmt->execute([$input['name'], $input['email']]);
        http_response_code(201);
        echo json_encode([
            "id"      => $pdo->lastInsertId(),
            "status"  => "created",
            "message" => "Usuário criado com sucesso",
        ]);
        break;

    // PUT /users/123
    case 'PUT':
        if (!isset($parts[2])) {
            http_response_code(400);
            echo json_encode(["erro" => "ID do usuário é obrigatório"]);
            break;
        }
        $stmt = $pdo->prepare("UPDATE users SET name = ?, email = ? WHERE id = ?");
        $stmt->execute([$input['name'] ?? '', $input['email'] ?? '', $parts[2]]);
        echo json_encode(["status" => "updated"]);
        break;

    // DELETE /users/123
    case 'DELETE':
        if (!isset($parts[2])) {
            http_response_code(400);
            echo json_encode(["erro" => "ID do usuário é obrigatório"]);
            break;
        }
        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$parts[2]]);
        echo json_encode(["status" => "deleted"]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["erro" => "Método não permitido"]);
}

// ============================================================
// 5. FUNÇÕES ÚTEIS
// ============================================================

// Sanitizar entrada (básico - sempre usar prepared statements também)
function sanitizar($dado) {
    return htmlspecialchars(trim($dado), ENT_QUOTES, 'UTF-8');
}

// Resposta JSON padronizada
function responder($dados, $statusCode = 200) {
    http_response_code($statusCode);
    header("Content-Type: application/json; charset=UTF-8");
    echo json_encode($dados, JSON_UNESCAPED_UNICODE);
    exit;
}

// Validação simples de email
function emailValido($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

// ============================================================
// 6. BOAS PRÁTICAS (falar na entrevista)
// ============================================================
/*
- SEMPRE usar prepared statements (nunca concatenação direta na query)
- Tratar erros com try/catch, nunca mostrar erro do PDO pro usuário
- Usar transactions em operações que dependem umas das outras
- Retornar status codes HTTP corretos (200, 201, 400, 404, 500)
- Validar dados de entrada antes de processar
- Em produção: usar Composer + autoload, não mixurar lógica com apresentação
*/

echo "// PHP Cheat Sheet carregado com sucesso!";
