<template>
  <GaugeBase
    v-bind="$attrs"
    sweep="horseshoe"
    thickness="medium"
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
  aspect: 1.33,
  minHeight: 90
})
</script>
