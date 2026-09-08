<template>
  <AppList
    v-bind="preset"
    empty-text="No payments completed yet."
    empty-icon="savings"
    @click="onOpen"
  />
</template>

<script setup>
import { computed } from 'vue'
import AppList from 'components/app/AppList.vue'
import { useOutletPaymentIndexContext } from 'src/_ui/AQL/composables/Operation/OutletPayments/Index/useOutletPaymentIndexContext'
import { paymentRowPreset } from 'src/_ui/AQL/composables/Operation/OutletPayments/Index/usePaymentRowPresets'

defineOptions({ name: 'OutletPaymentsListCompletedPayments', inheritAttrs: false })

const { views, filterPayments, openPayment } = useOutletPaymentIndexContext()

const preset = computed(() => paymentRowPreset(filterPayments(views.value.CompletedPayments || [])))

const onOpen = (item) => openPayment(item?.code)
</script>
