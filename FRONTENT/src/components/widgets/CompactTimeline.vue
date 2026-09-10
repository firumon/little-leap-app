<template>
  <TimelineBase
    v-bind="$attrs"
    direction="horizontal"
    marker-shape="dot"
    :show-connector="true"
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </TimelineBase>
</template>

<script setup>
import TimelineBase from 'src/components/widgets/TimelineBase.vue'

defineOptions({
  inheritAttrs: false,
  aspect: 3,
  minHeight: 60
})
</script>
