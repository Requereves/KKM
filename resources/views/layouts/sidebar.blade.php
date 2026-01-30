<aside class="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col h-screen fixed left-0 top-0 bottom-0 z-50">
    <div class="shrink-0 flex items-center justify-center h-16 border-b border-gray-100">
        <a href="{{ route('dashboard') }}">
            <x-application-logo class="block h-9 w-auto fill-current text-gray-800" />
        </a>
    </div>

    <nav class="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        <x-nav-link :href="route('dashboard')" :active="request()->routeIs('dashboard')" class="block w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 {{ request()->routeIs('dashboard') ? 'bg-gray-100 text-gray-900' : 'text-gray-600' }}">
            {{ __('Dashboard') }}
        </x-nav-link>

        <x-nav-link :href="route('profile.edit')" :active="request()->routeIs('profile.edit')" class="block w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 {{ request()->routeIs('profile.edit') ? 'bg-gray-100 text-gray-900' : 'text-gray-600' }}">
            {{ __('Profile') }}
        </x-nav-link>

        {{-- Tambahkan link Jobs/Students nanti di sini --}}
    </nav>
</aside>