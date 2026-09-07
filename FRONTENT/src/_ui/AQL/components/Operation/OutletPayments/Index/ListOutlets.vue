<template>
  <AppList
    v-bind="preset"
    empty-text="No outlet owes anything."
    empty-icon="task_alt"
    @click="onStart"
  />
</template>

<script setup>
import { computed } from 'vue'
import AppList from 'components/app/AppList.vue'
import { useOutletPaymentIndexContext } from 'src/_ui/AQL/composables/Operation/OutletPayments/Index/useOutletPaymentIndexContext'
import { outletDebtPreset } from 'src/_ui/AQL/composables/Operation/OutletPayments/Index/usePaymentRowPresets'

defineOptions({ name: 'OutletPaymentsListOutlets', inheritAttrs: false })

const { views, startPayment } = useOutletPaymentIndexContext()

const preset = computed(() => outletDebtPreset(views.value.Outlets || []))

const onStart = (item) => startPayment(item?.code)
</script>
