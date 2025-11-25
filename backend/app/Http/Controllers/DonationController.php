<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Donation;

class DonationController extends Controller
{
    public function getUserDonations($user_id)
    {
        $donations = Donation::where('user_id', $user_id)->orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'donations' => $donations
        ]);
    }

    public function addDonation(Request $request)
    {
        $validated = $request->validate([
            'user_id'        => 'required',
            'item_name'      => 'required',
            'category'       => 'required',
            'type'           => 'required',
            'quantity'       => 'required|integer',
            'condition'      => 'required',
            'description'    => 'required',
            'pickup_address' => 'required',
            'charity_name'   => 'required',
            'item_image'     => 'nullable|image|max:4096',
        ]);

        if ($request->hasFile('item_image')) {
            $validated['item_image'] = $request->file('item_image')->store('uploads', 'public');
        }

        Donation::create($validated);

        return response()->json([
            'status'  => 'success',
            'message' => 'Donation submitted successfully!'
        ]);
    }
}
