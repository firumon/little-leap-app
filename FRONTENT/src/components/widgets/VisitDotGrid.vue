<template>
  <WaffleBase
    v-bind="$attrs"
    grid-size="5x5"
    block-shape="circle"
    fill-direction="left-right"
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </WaffleBase>
</template>

<script setup>
import WaffleBase from 'src/components/widgets/WaffleBase.vue'

defineOptions({
  inheritAttrs: false,
  aspect: 1,
  minHeight: 80
})
</script>
