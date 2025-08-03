import React from 'react';
import { usePage } from '@inertiajs/react';

export default function VerifyEmail() {
  const { auth } = usePage().props;

  return (
    <div>
      <h1>Bestätige deine E-Mail-Adresse</h1>
      <p>
        Wir haben einen Aktivierungslink an <b>{auth.user.email}</b> gesendet.<br/>
        Bitte prüfe dein Postfach (und Spam-Ordner)!
      </p>
      {/* Optional: Button zum erneuten Versand */}
    </div>
  );
}
