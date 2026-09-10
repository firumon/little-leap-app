<template>
  <DonutBase
    v-bind="$attrs"
    hole-size="large"
    sweep-angle="half"
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
  aspect: 2,
  minHeight: 70
})
</script>
