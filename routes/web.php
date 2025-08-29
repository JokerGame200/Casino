<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\RegisteredUserController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->get('/dashboard', function () {
    return Inertia::render('Dashboard', [
        'isEmailVerified' => auth()->user()->hasVerifiedEmail(),
    ]);
})->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    // weitere Routen...
});


// Datenschutz und AGB Seiten
Route::get('/Terms&Conditions', function () {
    return Inertia::render('RAI/AGB'); 
})->name('AGB');

Route::get('/privacy-policy', function () {
    return Inertia::render('RAI/privacy'); 
})->name('privacy-policy');

Route::get('/FAQ', function () {
    return Inertia::render('RAI/FAQ'); 
})->name('FAQ');

Route::get('/Safer-Gambling', function () {
    return Inertia::render('RAI/Safer-Gambling'); 
})->name('Safer-Gambling');

require __DIR__.'/auth.php';
