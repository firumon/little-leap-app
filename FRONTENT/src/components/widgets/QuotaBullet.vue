<template>
  <BulletBase
    v-bind="$attrs"
    orientation="horizontal"
    zone-style="muted"
    marker-shape="line"
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
  aspect: 5,
  minHeight: 64
})
</script>
