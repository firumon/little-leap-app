<template>
  <BulletBase
    v-bind="$attrs"
    orientation="vertical"
    zone-style="contrast"
    marker-shape="triangle"
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </BulletBase>
</template>

<script setup>
import BulletBase from 'src/components/widgets/BulletBase.vue'

defineOptions({
  inheritAttrs: false,
  aspect: 0.25,
  minHeight: 100
})
</script>
