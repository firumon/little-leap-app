<template>
  <FunnelBase
    v-bind="$attrs"
    direction="vertical"
    shape="stepped"
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
  aspect: 0.75,
  minHeight: 120
})
</script>
