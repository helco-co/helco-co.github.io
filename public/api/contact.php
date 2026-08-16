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
$bodyHtml = optional_post_field('bodyHtml', 20000);

if (!filter_var($replyToEmail, FILTER_VALIDATE_EMAIL)) {
    send_json(422, ['success' => false, 'error' => 'Invalid email address']);
}

$ok = send_mail_with_attachment(RECIPIENT_BUSINESS, $subject, $replyToName, $replyToEmail, $body, null, $bodyHtml);

if (!$ok) {
    send_json(502, ['success' => false, 'error' => 'Mail server rejected the message']);
}

send_json(200, ['success' => true]);
