<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\API\RegisterController;
use App\Http\Controllers\API\UsersController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user/me', function (Request $request) {
    return $request->user();
});

Route::controller(RegisterController::class)->group(function(){
    Route::post('login', 'login');
    Route::post('register', 'register')
        ->middleware('auth:sanctum')
        ->middleware('admin');
});

Route::middleware('auth:sanctum')->group( function () {
    Route::get('users', [UsersController::class, 'index']);
    Route::get('users/{user}', [UsersController::class, 'show']);
    Route::middleware('admin')->group( function () {
        // Admin access only
        Route::put('users/{user}', [UsersController::class, 'update']);
        Route::delete('users/{user}', [UsersController::class, 'destroy']);
    });
});
