<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DonationController;
use App\Http\Controllers\CharityController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| These routes are for your React front-end SPA and existing tests.
|
*/

// ---- Existing routes (keep them all) ----
// routes/api.php


// Test/debug endpoints
Route::get('/status', function () {
    return response()->json(['message' => 'Laravel API working']);
});
Route::get('/test-db', function () {
    return response()->json(['tables' => DB::select("SELECT name FROM sqlite_master WHERE type='table'")]);
});
Route::get('/users', function () {
    return DB::table('users')->get();
});

// Auth routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::get('/donations/{user_id}', [DonationController::class, 'getUserDonations']);
Route::post('/donations', [DonationController::class, 'addDonation']);
Route::get('/charities', [CharityController::class, 'getCharities']);