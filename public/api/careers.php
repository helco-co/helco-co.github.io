<?php

declare(strict_types=1);
require __DIR__ . '/_send.php';

apply_cors();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    send_json(405, ['success' => false, 'error' => 'Method not allowed']);
}

reject_if_bot();

$subject = require_post_field('subject', 300);
$replyToName = require_post_field('replyToName', 200);
$replyToEmail = require_post_field('replyToEmail', 200);
$body = require_post_field('body', 8000);

if (!filter_var($replyToEmail, FILTER_VALIDATE_EMAIL)) {
    send_json(422, ['success' => false, 'error' => 'Invalid email address']);
}

// The CV is optional in the form itself, so it is optional here too.
$attachment = null;
if (!empty($_FILES['cv']) && $_FILES['cv']['error'] !== UPLOAD_ERR_NO_FILE) {
    $file = $_FILES['cv'];

    if ($file['error'] !== UPLOAD_ERR_OK) {
        send_json(422, ['success' => false, 'error' => 'CV upload failed']);
    }
    if (!is_uploaded_file($file['tmp_name'])) {
        send_json(400, ['success' => false, 'error' => 'Invalid upload']);
    }

    $maxBytes = 8 * 1024 * 1024; // Comfortably under common inbound attachment limits.
    if ($file['size'] > $maxBytes) {
        send_json(413, ['success' => false, 'error' => 'CV file is too large (8MB max)']);
    }

    $ext = strtolower((string) pathinfo($file['name'], PATHINFO_EXTENSION));
    $allowedTypes = [
        'pdf' => 'application/pdf',
        'doc' => 'application/msword',
        'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!isset($allowedTypes[$ext])) {
        send_json(422, ['success' => false, 'error' => 'CV must be a PDF, DOC, or DOCX file']);
    }

    $attachment = [
        'path' => $file['tmp_name'],
        'name' => $file['name'],
        'type' => $allowedTypes[$ext],
    ];
}

$ok = send_mail_with_attachment($subject, $replyToName, $replyToEmail, $body, $attachment);

if (!$ok) {
    send_json(502, ['success' => false, 'error' => 'Mail server rejected the message']);
}

send_json(200, ['success' => true]);
