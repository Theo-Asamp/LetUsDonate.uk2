<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DonationController;
use App\Http\Controllers\CharityController;

// ----------- Debug / sanity-check routes -----------
Route::get('/status', function () {
    return response()->json(['message' => 'Laravel API working']);
});

Route::get('/test-db', function () {
    return response()->json([
        'tables' => DB::select("SELECT name FROM sqlite_master WHERE type='table'")
    ]);
});

Route::get('/users', function () {
    return DB::table('users')->get();
});

// ----------- Charity Routes -----------
Route::get('/charities', [CharityController::class, 'index']);  // used by frontend dropdowns

// ----------- Auth Routes -----------
Route::post('/login',  [AuthController::class, 'login']);
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/logout', [AuthController::class, 'logout']);

// ----------- Donation Routes -----------
Route::get('/donations/{donorId}', [DonationController::class, 'getUserDonations']);
Route::post('/donations',          [DonationController::class, 'store']);
