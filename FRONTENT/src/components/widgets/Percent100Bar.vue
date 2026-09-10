<template>
  <BarBase
    v-bind="$attrs"
    orientation="horizontal"
    mode="percent100"
    bar-width="thick"
    min-tier="compact"
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </BarBase>
</template>

<script setup>
import BarBase from 'src/components/widgets/BarBase.vue'

defineOptions({
  inheritAttrs: false,
  aspect: 1.33,
  minHeight: 120
})
</script>
