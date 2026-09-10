<template>
  <GaugeBase
    v-bind="$attrs"
    sweep="half"
    thickness="thick"
    :show-needle="true"
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
  aspect: 2,
  minHeight: 80
})
</script>
