<?php

namespace App\Http\Controllers;

use App\Models\Charity;
use Illuminate\Http\Request;

class CharityController extends Controller
{
    /**
     * Return all charities for the donation form
     */
    public function getCharities()
    {
        $charities = Charity::orderBy('charity_name', 'asc')->get();

        return response()->json([
            'status'    => 'success',
            'charities' => $charities,
        ]);
    }
}
