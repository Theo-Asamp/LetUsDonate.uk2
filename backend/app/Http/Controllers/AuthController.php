<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * Login
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Invalid email or password',
            ], 401);
        }

        $user = Auth::user();

        return response()->json([
            'status' => 'success',
            'user'   => $user,
        ]);
    }

    /**
     * Signup / registration
     * Expects: first_name, last_name, email, password, password_confirmation
     */
    public function signup(Request $request)
    {
        $data = $request->validate([
            'first_name'            => ['required', 'string', 'max:255'],
            'last_name'             => ['required', 'string', 'max:255'],
            'email'                 => ['required', 'email', 'unique:users,email'],
            'password'              => ['required', 'string', 'min:6', 'confirmed'],
        ]);

        $user = User::create([
            'first_name' => $data['first_name'],
            'last_name'  => $data['last_name'],
            'email'      => $data['email'],
            'password'   => Hash::make($data['password']),
        ]);

        Auth::login($user);

        return response()->json([
            'status' => 'success',
            'user'   => $user,
        ], 201);
    }

    /**
     * Logout (optional for your SPA)
     */
    public function logout(Request $request)
    {
        Auth::logout();

        // If using session-based auth
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'status' => 'success',
        ]);
    }
}
