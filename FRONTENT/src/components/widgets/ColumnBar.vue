<template>
  <BarBase
    v-bind="$attrs"
    orientation="vertical"
    mode="single"
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
  aspect: 1.78,
  minHeight: 120
})
</script>
