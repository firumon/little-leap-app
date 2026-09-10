<template>
  <FunnelBase
    v-bind="$attrs"
    direction="horizontal"
    shape="smooth"
    neck-style="straight"
    min-tier="compact"
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </FunnelBase>
</template>

<script setup>
import FunnelBase from 'src/components/widgets/FunnelBase.vue'

defineOptions({
  inheritAttrs: false,
  aspect: 2,
  minHeight: 100
})
</script>
