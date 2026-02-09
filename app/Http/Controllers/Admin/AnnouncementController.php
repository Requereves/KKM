<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class AnnouncementController extends Controller
{
    public function index()
    {
        $announcements = Announcement::latest()->get()->map(function($item) {
            return [
                'id' => $item->id,
                'title' => $item->title,
                'content' => $item->content,
                'category' => $item->category,
                'status' => $item->status,
                'targetAudience' => $item->target_audience,
                'publishDate' => $item->publish_date ? \Carbon\Carbon::parse($item->publish_date)->format('Y-m-d') : null,
                'author' => $item->author,
                'image' => $item->image ? asset('storage/' . $item->image) : null,
            ];
        });

        return Inertia::render('Admin/CMS/Index', [
            'announcements' => $announcements
        ]);
    }

    // Untuk render form Create/Edit
    public function create() {
        return Inertia::render('Admin/CMS/AnnouncementForm', ['mode' => 'create']);
    }

    public function edit(Announcement $cms) { // Parameter binding 'cms' sesuai route resource
        return Inertia::render('Admin/CMS/AnnouncementForm', [
            'mode' => 'edit',
            'initialData' => [
                'id' => $cms->id,
                'title' => $cms->title,
                'content' => $cms->content,
                'category' => $cms->category,
                'status' => $cms->status,
                'targetAudience' => $cms->target_audience,
                'publishDate' => $cms->publish_date,
                'image' => $cms->image ? asset('storage/' . $cms->image) : null,
            ]
        ]);
    }

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

        // Mapping nama field camelCase (React) ke snake_case (DB)
        $dbData = [
            'title' => $data['title'],
            'category' => $data['category'],
            'status' => $data['status'],
            'target_audience' => $data['targetAudience'],
            'publish_date' => $data['publishDate'],
            'content' => $data['content'],
            'author' => auth()->user()->name ?? 'Admin',
        ];

        if ($request->hasFile('image')) {
            $dbData['image'] = $request->file('image')->store('announcements', 'public');
        }

        Announcement::create($dbData);

        return redirect()->route('cms.index')->with('success', 'Announcement created successfully!');
    }

    public function update(Request $request, Announcement $cms)
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
        ];

        if ($request->hasFile('image')) {
            if ($cms->image) Storage::disk('public')->delete($cms->image);
            $dbData['image'] = $request->file('image')->store('announcements', 'public');
        }

        $cms->update($dbData);

        return redirect()->route('cms.index')->with('success', 'Announcement updated successfully!');
    }

    public function destroy(Announcement $cms)
    {
        if ($cms->image) Storage::disk('public')->delete($cms->image);
        $cms->delete();
        return redirect()->back()->with('success', 'Announcement deleted successfully!');
    }
}