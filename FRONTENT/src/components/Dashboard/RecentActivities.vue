<template>
    <q-card class="recent-activities full-height" flat bordered>
        <q-card-section>
            <div class="text-h6">Recent Activity</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
            <q-timeline color="secondary">
                <q-timeline-entry v-for="activity in activities" :key="activity.id" :title="activity.title"
                    :subtitle="activity.time" :color="activity.color" :icon="activity.icon">
                    <div>
                        {{ activity.description }}
                    </div>
                </q-timeline-entry>
            </q-timeline>
        </q-card-section>
    </q-card>
</template>

<script setup>
defineProps({
    activities: {
        type: Array,
        required: true,
        default: () => []
    }
})
</script>
