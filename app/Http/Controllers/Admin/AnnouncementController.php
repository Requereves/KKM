<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class AnnouncementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Ambil data dan format untuk React
        $announcements = Announcement::latest()->get()->map(function($item) {
            return [
                'id' => $item->id,
                'title' => $item->title,
                'content' => $item->content,
                'category' => $item->category,
                'status' => $item->status,
                'targetAudience' => $item->target_audience,
                // Field 'date' untuk tampilan List di Index.jsx
                'date' => $item->publish_date ? Carbon::parse($item->publish_date)->format('d M Y') : '-',
                // Field 'publishDate' untuk form Edit (Format Input Date)
                'publishDate' => $item->publish_date ? Carbon::parse($item->publish_date)->format('Y-m-d') : '',
                'author' => $item->author,
                'image' => $item->image ? asset('storage/' . $item->image) : null,
            ];
        });

        return Inertia::render('Admin/CMS/Index', [
            'announcements' => $announcements
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/CMS/AnnouncementForm', [
            'mode' => 'create'
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'status' => 'required|string',
            'targetAudience' => 'required|string',
            'publishDate' => 'required|date',
            'content' => 'required|string',
            'image' => 'nullable|image|max:2048',
        ]);

        $dbData = [
            'title' => $data['title'],
            'category' => $data['category'],
            'status' => $data['status'],
            'target_audience' => $data['targetAudience'],
            'publish_date' => $data['publishDate'],
            'content' => $data['content'],
            'author' => Auth::user()->name ?? 'Admin',
        ];

        if ($request->hasFile('image')) {
            $dbData['image'] = $request->file('image')->store('announcements', 'public');
        }

        Announcement::create($dbData);

        // Redirect ke route yang benar (admin.cms.index)
        return redirect()->route('admin.cms.index')->with('success', 'Announcement created successfully!');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $cms = Announcement::findOrFail($id);

        return Inertia::render('Admin/CMS/AnnouncementForm', [
            'mode' => 'edit',
            'initialData' => [
                'id' => $cms->id,
                'title' => $cms->title,
                'content' => $cms->content,
                'category' => $cms->category,
                'status' => $cms->status,
                'targetAudience' => $cms->target_audience,
                'publishDate' => $cms->publish_date ? Carbon::parse($cms->publish_date)->format('Y-m-d') : '',
                'image' => $cms->image ? asset('storage/' . $cms->image) : null,
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $cms = Announcement::findOrFail($id);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'status' => 'required|string',
            'targetAudience' => 'required|string',
            'publishDate' => 'required|date',
            'content' => 'required|string',
            'image' => 'nullable|image|max:2048',
        ]);

        $dbData = [
            'title' => $data['title'],
            'category' => $data['category'],
            'status' => $data['status'],
            'target_audience' => $data['targetAudience'],
            'publish_date' => $data['publishDate'],
            'content' => $data['content'],
        ];

        if ($request->hasFile('image')) {
            if ($cms->image && Storage::disk('public')->exists($cms->image)) {
                Storage::disk('public')->delete($cms->image);
            }
            $dbData['image'] = $request->file('image')->store('announcements', 'public');
        }

        $cms->update($dbData);

        return redirect()->route('admin.cms.index')->with('success', 'Announcement updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $cms = Announcement::findOrFail($id);

        if ($cms->image && Storage::disk('public')->exists($cms->image)) {
            Storage::disk('public')->delete($cms->image);
        }
        
        $cms->delete();
        
        return redirect()->back()->with('success', 'Announcement deleted successfully!');
    }
}