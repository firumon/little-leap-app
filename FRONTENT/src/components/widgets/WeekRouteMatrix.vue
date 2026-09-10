<template>
  <HeatGridBase
    v-bind="$attrs"
    layout="matrix"
    cell-round="round"
    cell-gap="loose"
    min-tier="standard"
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
  aspect: 1.78,
  minHeight: 120
})
</script>
