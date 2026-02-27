<?php
/**
 * Обработчик формы «Заказать звонок»
 * Отправляет письмо на вашу личную почту
 */

// ============================================
// ⬇️  УКАЖИТЕ ВАШУ ПОЧТУ ЗДЕСЬ  ⬇️
// ============================================
$to_email = 'platon.kapa@gmail.com';   // <-- ЗАМЕНИТЕ НА СВОЮ ПОЧТУ
// ============================================

// Заголовок ответа — JSON
header('Content-Type: application/json; charset=utf-8');

// Принимаем только POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Метод не поддерживается']);
    exit;
}

// Получаем данные
$name  = isset($_POST['name'])  ? trim(strip_tags($_POST['name']))  : '';
$phone = isset($_POST['phone']) ? trim(strip_tags($_POST['phone'])) : '';

// Валидация на сервере
if (empty($name) || mb_strlen($name) < 2) {
    echo json_encode(['success' => false, 'message' => 'Укажите имя']);
    exit;
}

// Проверяем, что в телефоне есть 11 цифр
$phone_digits = preg_replace('/\D/', '', $phone);
if (strlen($phone_digits) < 11) {
    echo json_encode(['success' => false, 'message' => 'Укажите корректный телефон']);
    exit;
}

// Формируем письмо
$subject = '🔔 Новая заявка с сайта ОЛИМП ГРУПП';

$message = "
<!DOCTYPE html>
<html>
<head><meta charset='utf-8'></head>
<body style='font-family: Arial, sans-serif; background: #f4f7f9; padding: 20px;'>
    <div style='max-width: 500px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);'>
        
        <div style='background: #0e2a47; color: white; padding: 25px 30px; text-align: center;'>
            <h1 style='margin: 0; font-size: 20px;'>📞 Новая заявка на звонок</h1>
        </div>
        
        <div style='padding: 30px;'>
            <table style='width: 100%; border-collapse: collapse;'>
                <tr>
                    <td style='padding: 12px 0; color: #888; font-size: 14px; border-bottom: 1px solid #eee;'>Имя:</td>
                    <td style='padding: 12px 0; font-weight: bold; font-size: 16px; border-bottom: 1px solid #eee;'>{$name}</td>
                </tr>
                <tr>
                    <td style='padding: 12px 0; color: #888; font-size: 14px;'>Телефон:</td>
                    <td style='padding: 12px 0; font-weight: bold; font-size: 16px;'>
                        <a href='tel:{$phone_digits}' style='color: #0e2a47; text-decoration: none;'>{$phone}</a>
                    </td>
                </tr>
            </table>
        </div>
        
        <div style='background: #f0bd1c; padding: 15px 30px; text-align: center;'>
            <p style='margin: 0; color: #0e2a47; font-weight: bold; font-size: 13px;'>
                Отправлено с сайта ОЛИМП ГРУПП • " . date('d.m.Y H:i') . "
            </p>
        </div>
        
    </div>
</body>
</html>
";

// Заголовки письма
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=utf-8\r\n";
$headers .= "From: ОЛИМП ГРУПП <noreply@" . $_SERVER['HTTP_HOST'] . ">\r\n";
$headers .= "Reply-To: noreply@" . $_SERVER['HTTP_HOST'] . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Отправляем
$result = mail($to_email, $subject, $message, $headers);

if ($result) {
    echo json_encode(['success' => true, 'message' => 'Письмо отправлено']);
} else {
    echo json_encode(['success' => false, 'message' => 'Не удалось отправить письмо']);
}
?>