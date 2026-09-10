<template>
  <GaugeBase
    v-bind="$attrs"
    sweep="full"
    thickness="thin"
    :show-needle="false"
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </GaugeBase>
</template>

<script setup>
import GaugeBase from 'src/components/widgets/GaugeBase.vue'

defineOptions({
  inheritAttrs: false,
  aspect: 1,
  minHeight: 90
})
</script>
