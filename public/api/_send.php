<?php

declare(strict_types=1);

// Shared by every endpoint in this folder. Not requestable directly —
// api/.htaccess denies any filename starting with "_".

// Two separate inboxes: business inquiries go to the general firm address,
// CVs go straight to HR rather than being forwarded on manually.
const RECIPIENT_BUSINESS = 'Info@hanyelaraby.com';
const RECIPIENT_HR = 'HR@hanyelaraby.com';

// The built site is mirrored to more than one host (the live domain, plus a
// GitHub Pages copy used while building the site); either one needs to be
// able to reach this endpoint, which only ever runs on the live domain.
const ALLOWED_ORIGINS = [
    'https://hanyelaraby.com',
    'https://www.hanyelaraby.com',
    'https://helco-co.github.io',
];

function send_json(int $status, array $body): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($body);
    exit;
}

function apply_cors(): void
{
    header('Vary: Origin');
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (in_array($origin, ALLOWED_ORIGINS, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Access-Control-Allow-Methods: POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
    }
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

/** Strips characters that could inject extra headers into the outgoing mail
 *  (classic PHP mail() CRLF header injection) from anything pulled out of
 *  the request and placed into a header: display name, reply-to address,
 *  subject. */
function clean_header_value(string $v): string
{
    return trim(preg_replace('/[\r\n]+/', ' ', $v));
}

function require_post_field(string $name, int $maxLen = 4000): string
{
    $v = trim((string) ($_POST[$name] ?? ''));
    if ($v === '') {
        send_json(422, ['success' => false, 'error' => "Missing required field: $name"]);
    }
    if (mb_strlen($v) > $maxLen) {
        send_json(422, ['success' => false, 'error' => "Field too long: $name"]);
    }
    return $v;
}

/** Honeypot field plus a minimum render-to-submit time. Both catch the
 *  overwhelming majority of automated spam without asking a real visitor to
 *  prove anything — the right tradeoff for a quiet B2B contact form, not a
 *  high-value target that would justify a CAPTCHA. */
function reject_if_bot(): void
{
    if (trim((string) ($_POST['_hp'] ?? '')) !== '') {
        // Looks like a bot. Report success without sending anything, so a
        // scripted submitter gets no signal that it was caught.
        send_json(200, ['success' => true]);
    }
    $renderedAt = (float) ($_POST['_ts'] ?? 0);
    if ($renderedAt > 0 && (microtime(true) * 1000 - $renderedAt) < 1500) {
        send_json(200, ['success' => true]);
    }
}

function build_mime_boundary(): string
{
    return '----helco-' . bin2hex(random_bytes(16));
}

/**
 * Sends a plain-text email, optionally with one file attachment, via PHP's
 * mail(). The MIME body is built by hand rather than through a library —
 * a single optional attachment is simple enough not to justify vendoring
 * one, and it keeps this endpoint dependency-free.
 *
 * @param array{path: string, name: string, type: string}|null $attachment
 */
function send_mail_with_attachment(
    string $recipient,
    string $subject,
    string $replyToName,
    string $replyToEmail,
    string $bodyText,
    ?array $attachment
): bool {
    $subject = clean_header_value($subject);
    $replyToName = clean_header_value($replyToName);
    $replyToEmail = clean_header_value($replyToEmail);

    // Sending "From" the visitor's own address gets these flagged as spam by
    // most receiving servers (SPF/DKIM won't match) — From stays on this
    // domain, and Reply-To carries the visitor's address so a reply in the
    // firm's inbox still goes straight to them.
    $host = preg_replace('/^www\./', '', $_SERVER['HTTP_HOST'] ?? 'hanyelaraby.com');
    $fromAddress = 'website@' . $host;

    $headers = [];
    $headers[] = 'From: HELCO Website <' . $fromAddress . '>';
    $headers[] = 'Reply-To: ' . $replyToName . ' <' . $replyToEmail . '>';
    $headers[] = 'MIME-Version: 1.0';

    if ($attachment !== null) {
        $boundary = build_mime_boundary();
        $headers[] = 'Content-Type: multipart/mixed; boundary="' . $boundary . '"';

        $safeName = preg_replace('/[^A-Za-z0-9._-]/', '_', $attachment['name']);
        $fileData = file_get_contents($attachment['path']);

        $body = "--$boundary\r\n";
        $body .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
        $body .= $bodyText . "\r\n\r\n";
        $body .= "--$boundary\r\n";
        $body .= 'Content-Type: ' . $attachment['type'] . '; name="' . $safeName . "\"\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n";
        $body .= 'Content-Disposition: attachment; filename="' . $safeName . "\"\r\n\r\n";
        $body .= chunk_split(base64_encode($fileData));
        $body .= "--$boundary--";
    } else {
        $headers[] = 'Content-Type: text/plain; charset=UTF-8';
        $body = $bodyText;
    }

    return mail($recipient, $subject, $body, implode("\r\n", $headers));
}
