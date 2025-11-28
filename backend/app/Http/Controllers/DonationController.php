<?php

namespace App\Http\Controllers;

use App\Models\Donation;
use App\Models\DonationItem;
use App\Models\Charity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DonationController extends Controller
{
    /**
     * GET /api/donations/{donorId}
     * Return all donations for a given donor, with items + charity.
     */
    public function getUserDonations($donorId)
    {
        $donations = Donation::with(['items', 'charity'])
            ->where('donor_ID', $donorId)
            ->orderByDesc('donation_date')
            ->get();

        return response()->json([
            'status'    => 'success',
            'donations' => $donations,
        ]);
    }

    /**
     * POST /api/donations
     * Creates a Donation + one DonationItem (your current frontend sends a single item).
     *
     * Expected fields from frontend:
     *  - donor_ID
     *  - charity_ID
     *  - item_name
     *  - category       (item_category)
     *  - type           (item_size)
     *  - condition      (item_condition)
     *  - description    (item_description)
     *  - image (file)   (item_image)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'donor_ID'     => ['required', 'integer'],
            'charity_ID'   => ['required', 'integer', 'exists:Charity,charity_ID'],
            'item_name'    => ['required', 'string', 'max:255'],
            'category'     => ['required', 'string', 'max:255'],
            'type'         => ['nullable', 'string', 'max:255'],
            'condition'    => ['required', 'string', 'max:255'],
            'description'  => ['nullable', 'string'],
            'image'        => ['nullable', 'image', 'max:4096'],
        ]);

        // Handle optional image upload
        $imagePath = null;
        if ($request->hasFile('image')) {
            // stored under storage/app/public/donation_images
            $imagePath = $request->file('image')->store('donation_images', 'public');
        }

        // Create the donation row
        $donation = Donation::create([
            'donor_ID'        => $validated['donor_ID'],
            'charity_ID'      => $validated['charity_ID'],
            'donation_status' => 'Pending',
            'donation_date'   => now(),
        ]);

        // Create the associated single item
        DonationItem::create([
            'donation_ID'       => $donation->donation_ID,
            'item_name'         => $validated['item_name'],
            'item_category'     => $validated['category'],
            'item_size'         => $validated['type'] ?? null,
            'item_condition'    => $validated['condition'],
            'item_description'  => $validated['description'] ?? null,
            'item_image'        => $imagePath,
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Donation submitted successfully!',
        ], 201);
    }
}
