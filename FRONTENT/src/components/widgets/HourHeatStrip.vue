<template>
  <HeatGridBase
    v-bind="$attrs"
    layout="strip"
    cell-round="none"
    cell-gap="tight"
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </HeatGridBase>
</template>

<script setup>
import HeatGridBase from 'src/components/widgets/HeatGridBase.vue'

defineOptions({
  inheritAttrs: false,
  aspect: 5,
  minHeight: 40
})
</script>
