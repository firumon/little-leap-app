<template>
  <DonutBase
    v-bind="$attrs"
    hole-size="medium"
    sweep-angle="full"
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </DonutBase>
</template>

<script setup>
import DonutBase from 'src/components/widgets/DonutBase.vue'

defineOptions({
  inheritAttrs: false,
  aspect: 1,
  minHeight: 90
})
</script>
