<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Models\DomainUser;

class AuthController extends Controller
{
    //login
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);
      
        //finds user by their email in the User table
        $user = DomainUser::where('user_email', $request->email)->first();
        //checks if user does exist and password is correct
        if ($user && Hash::check($request->password, $user->user_password)) {
            return response()->json([
                'status' => 'success',
                'user' => $user]);
        }
        
        return response()->json([
            'status' => 'error',
            'message' => 'Invalid credentials'
        ], 401);
    }

    //Sign up
    public function signup(Request $request)
    {
        //validates input
        $request->validate([
            'fullName' => 'required|string|max:255',
            'email' => 'required|email|unique:User,user_email',
            'password' => 'required|string|min:6',
        ]);
    
        //Automatically assigns the Donor role just becuase we only allow donors to signup due to security measures 
        $donorRole = \App\Models\Role::firstOrCreate(
            ['role_name' => 'donor'],
            ['role_description' => 'A person who donates clothing or items.']
        );
    
        //Creates the user
        $user = \App\Models\DomainUser::create([
            'user_name' => $request->fullName,
            'user_email' => $request->email,
            'user_password' => Hash::make($request->password),
            'role_ID' => $donorRole->role_ID,
        ]);
    
        //creates the donor record
        \App\Models\Donor::create([
            'user_ID' => $user->user_ID,
            'donor_address' => null,
        ]);
    
        return response()->json([
            'status' => 'success',
            'user' => $user
        ]);
    }
}
    
