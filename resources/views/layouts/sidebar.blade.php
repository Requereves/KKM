<aside class="w-64 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 hidden md:flex flex-col h-screen fixed left-0 top-0 bottom-0 z-50 transition-colors duration-200">
    
    <div class="shrink-0 flex items-center justify-center h-16 border-b border-gray-100 dark:border-gray-700">
        <a href="{{ route('dashboard') }}">
            <x-application-logo class="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
        </a>
    </div>

    <nav class="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        
        <x-nav-link :href="route('dashboard')" :active="request()->routeIs('dashboard')" 
            class="block w-full text-left px-4 py-2 rounded-md transition-colors duration-150
            {{ request()->routeIs('dashboard') 
                ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white' 
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200' 
            }}">
            {{ __('Dashboard') }}
        </x-nav-link>

        <x-nav-link :href="route('profile.edit')" :active="request()->routeIs('profile.edit')" 
            class="block w-full text-left px-4 py-2 rounded-md transition-colors duration-150
            {{ request()->routeIs('profile.edit') 
                ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white' 
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200' 
            }}">
            {{ __('Profile') }}
        </x-nav-link>

        <x-nav-link :href="route('portfolio.index')" :active="request()->routeIs('portfolio.*')" 
            class="block w-full text-left px-4 py-2 rounded-md transition-colors duration-150
            {{ request()->routeIs('portfolio.*') 
                ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white' 
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200' 
            }}">
            {{ __('My Portfolios') }}
        </x-nav-link>

    </nav>
</aside>