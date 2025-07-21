<script lang="ts">
    import { page } from '$app/stores';
    
    const navItems = [
        { name: 'Home', path: '/dashboard', icon: 'home' },
        { name: 'Research', path: '/research', icon: 'research' },
        { name: 'Discuss', path: '/discuss', icon: 'discuss' },
        { name: 'Level Up', path: '/level-up', icon: 'level' },
        { name: 'Vote', path: '/vote', icon: 'vote' },
        { name: 'Profile', path: '/profile', icon: 'profile' },
        { name: 'Settings', path: '/settings', icon: 'settings' }
    ];
</script>

<aside class="w-64 bg-white shadow-lg hidden lg:block">
    <div class="p-4">
        <!-- User Info -->
        <div class="mb-8">
            <h2 class="text-xl font-semibold">{$page.data.user?.fullName}</h2>
            <p class="text-sm text-gray-600">{$page.data.user?.title}</p>
            <p class="text-sm text-gray-500">{$page.data.user?.location}</p>
        </div>

        <!-- Navigation -->
        <nav class="space-y-1">
            {#each navItems as item}
                <a
                    href={item.path}
                    class="flex items-center p-3 rounded-lg hover:bg-gray-100 {($page.url.pathname === item.path) ? 'bg-gray-50 text-blue-600' : 'text-gray-700'}"
                >
                    <img 
                        src={`/icons/${item.icon}${$page.url.pathname === item.path ? '-filled' : ''}.png`}
                        alt={item.name}
                        class="w-5 h-5 mr-3"
                    />
                    {item.name}
                </a>
            {/each}
        </nav>

        <!-- User Metrics -->
        <div class="mt-8 pt-4 border-t border-gray-200">
            <h3 class="text-sm font-medium text-gray-900 mb-2">Your Metrics</h3>
            <div class="space-y-2">
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Knowledge</span>
                    <span class="text-gray-900">{$page.data.user?.knowledgePoints}</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Charisma</span>
                    <span class="text-gray-900">{$page.data.user?.charismaPoints}</span>
                </div>
            </div>
        </div>
    </div>
</aside>
