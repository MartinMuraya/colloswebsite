<?php

namespace App\Modules\Support\Presentation\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactMessage;

class ContactController extends Controller
{
    /**
     * Handle incoming contact form submission.
     */
    public function send(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        // Send email to the system administrator or store owner
        // Typically we'd get this from the Settings table, or fallback to an env variable
        $adminEmail = config('mail.from.address'); // Using the default sender as recipient for now
        
        Mail::to($adminEmail)->send(new ContactMessage($validated));

        return response()->json([
            'message' => 'Your message has been sent successfully! We will get back to you soon.'
        ]);
    }
}
