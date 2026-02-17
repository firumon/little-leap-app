<template>
    <q-card class="stat-card full-height" flat bordered :class="colorClass">
        <q-card-section>
            <div class="row items-center no-wrap">
                <div class="col">
                    <div class="text-h6 text-weight-bold">{{ value }}</div>
                    <div class="text-caption text-grey-7">{{ title }}</div>
                </div>
                <div class="col-auto">
                    <q-avatar :icon="icon" :text-color="color" size="42px" font-size="28px" class="bg-grey-2" />
                </div>
            </div>
            <div v-if="trend" class="row items-center q-mt-sm">
                <q-icon :name="trendIcon" :color="trendColor" size="xs" class="q-mr-xs" />
                <span :class="`text-${trendColor} text-caption text-weight-medium`">{{ trend }}</span>
                <span class="text-caption text-grey-6 q-ml-xs">vs last month</span>
            </div>
        </q-card-section>
    </q-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    value: {
        type: [String, Number],
        required: true
    },
    icon: {
        type: String,
        default: 'analytics'
    },
    color: {
        type: String,
        default: 'primary'
    },
    trend: {
        type: String,
        default: null
    },
    trendDirection: {
        type: String,
        default: 'up', // 'up' or 'down'
        validator: (val) => ['up', 'down', 'neutral'].includes(val)
    }
})

const colorClass = computed(() => {
    return `bg-white`
})

const trendIcon = computed(() => {
    if (props.trendDirection === 'up') return 'trending_up'
    if (props.trendDirection === 'down') return 'trending_down'
    return 'trending_flat'
})

const trendColor = computed(() => {
    if (props.trendDirection === 'up') return 'positive'
    if (props.trendDirection === 'down') return 'negative'
    return 'grey'
})
</script>

<style scoped lang="scss">
.stat-card {
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
        transform: translateY(-2px);
        box-shadow: $shadow-2;
    }
}
</style>
