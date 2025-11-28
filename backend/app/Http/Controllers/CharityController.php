<?php

namespace App\Http\Controllers;

use App\Models\Charity;

class CharityController extends Controller
{
    public function index()
    {
        return response()->json([
            'status'    => 'success',
            'charities' => Charity::orderBy('charity_name')->get(),
        ]);
    }
}
