import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDashboardStore = defineStore('dashboard', () => {
    const stats = ref([
        { title: 'Total Sales', value: '$12,450', icon: 'payments', color: 'positive', trend: '12%', trendDirection: 'up' },
        { title: 'Pending Orders', value: '8', icon: 'shopping_cart', color: 'warning', trend: '2', trendDirection: 'down' },
        { title: 'New Customers', value: '24', icon: 'group_add', color: 'info', trend: '5%', trendDirection: 'up' },
        { title: 'Low Stock Items', value: '3', icon: 'inventory_2', color: 'negative', trend: '1', trendDirection: 'up' }
    ])

    const recentActivities = ref([
        {
            id: 1,
            title: 'New Order #1234',
            time: '2 hours ago',
            description: 'Order placed by John Doe for 3 items.',
            icon: 'shopping_bag',
            color: 'primary'
        },
        {
            id: 2,
            title: 'Stock Update',
            time: '4 hours ago',
            description: 'Received shipment for "Wireless Mouse" (50 units).',
            icon: 'inventory',
            color: 'orange'
        },
        {
            id: 3,
            title: 'New Customer',
            time: '1 day ago',
            description: 'Jane Smith registered as a new user.',
            icon: 'person_add',
            color: 'info'
        },
        {
            id: 4,
            title: 'System Alert',
            time: '2 days ago',
            description: 'Weekly backup completed successfully.',
            icon: 'cloud_done',
            color: 'green'
        }
    ])

    function fetchDashboardData() {
        // In the future, this will fetch data from the backend (Google Sheets/API)
        // For now, we are using the mocked data above.
        return Promise.resolve({
            stats: stats.value,
            activities: recentActivities.value
        })
    }

    return {
        stats,
        recentActivities,
        fetchDashboardData
    }
})
