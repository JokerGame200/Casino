<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class EnsureEmailIsVerified
{
    public function handle($request, Closure $next)
    {
        if (
            Auth::check() &&
            Auth::user() instanceof \Illuminate\Contracts\Auth\MustVerifyEmail &&
            !Auth::user()->hasVerifiedEmail()
        ) {
            $email = Auth::user()->email;
            Auth::logout();

            return redirect()->route('verification.notice')
                ->with('status', 'Bitte bestätige zuerst deine E-Mail-Adresse. Wir haben eine Mail an '.$email.' geschickt.');
        }
        return $next($request);
    }
}
