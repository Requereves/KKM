<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between items-center">
            <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                {{ __('My Portfolios') }}
            </h2>
            <a href="{{ route('portfolio.create') }}" class="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150">
                + Upload New
            </a>
        </div>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            
            @if($portfolios->isEmpty())
                
                <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                    <div class="bg-gray-100 dark:bg-gray-700 rounded-full p-6 mb-4">
                        <svg class="w-16 h-16 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">You haven't uploaded a portfolio yet</h3>
                    <p class="text-gray-500 dark:text-gray-400 mt-1 mb-6 max-w-sm">
                        Start building your career profile by uploading your certificates, projects, or achievements.
                    </p>
                    <a href="{{ route('portfolio.create') }}" class="inline-flex items-center px-6 py-3 bg-indigo-600 border border-transparent rounded-md font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 shadow-lg">
                        Upload Your First Portfolio
                    </a>
                </div>

            @else

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    @foreach($portfolios as $portfolio)
                        <a href="{{ route('portfolio.show', $portfolio->id) }}" class="group block">
                            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg hover:shadow-md transition-shadow duration-200 h-full border border-transparent hover:border-indigo-500 dark:hover:border-indigo-500 relative">
                                
                                <div class="p-6">
                                    <div class="flex justify-between items-start mb-4">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                                            {{ ucwords(str_replace('_', ' ', $portfolio->category)) }}
                                        </span>
                                        
                                        @if($portfolio->status === 'approved')
                                            <span class="h-3 w-3 rounded-full bg-green-500" title="Approved"></span>
                                        @elseif($portfolio->status === 'rejected')
                                            <span class="h-3 w-3 rounded-full bg-red-500" title="Rejected"></span>
                                        @else
                                            <span class="h-3 w-3 rounded-full bg-yellow-500" title="Pending"></span>
                                        @endif
                                    </div>

                                    <h4 class="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2 line-clamp-1">
                                        {{ $portfolio->title }}
                                    </h4>
                                    <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 h-10">
                                        {{ $portfolio->description ?? 'No description provided.' }}
                                    </p>

                                    <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 pt-4 border-t border-gray-100 dark:border-gray-700">
                                        <span>{{ \Carbon\Carbon::parse($portfolio->created_at)->format('d M Y') }}</span>
                                        <span class="group-hover:translate-x-1 transition-transform duration-200">View Detail &rarr;</span>
                                    </div>
                                </div>
                            </div>
                        </a>
                    @endforeach
                </div>

            @endif
        </div>
    </div>
</x-app-layout>