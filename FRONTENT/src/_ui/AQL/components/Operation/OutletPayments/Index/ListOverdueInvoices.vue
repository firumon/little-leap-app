<template>
  <AppList
    v-bind="preset"
    empty-text="Nothing overdue. Every invoice is inside its terms."
    empty-icon="task_alt"
    @click="onStart"
  />
</template>

<script setup>
import { computed } from 'vue'
import AppList from 'components/app/AppList.vue'
import { useOutletPaymentIndexContext } from 'src/_ui/AQL/composables/Operation/OutletPayments/Index/useOutletPaymentIndexContext'
import { overdueInvoicePreset } from 'src/_ui/AQL/composables/Operation/OutletPayments/Index/usePaymentRowPresets'

defineOptions({ name: 'OutletPaymentsListOverdueInvoices', inheritAttrs: false })

const { views, startPayment } = useOutletPaymentIndexContext()

const preset = computed(() => overdueInvoicePreset(views.value.OverdueInvoices || []))

const onStart = (item) => startPayment(item?.outletCode, item?.code)
</script>
