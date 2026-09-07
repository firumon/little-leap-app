<template>
  <AppList
    v-bind="preset"
    empty-text="No part-paid invoices."
    empty-icon="incomplete_circle"
    @click="onOpen"
  />
</template>

<script setup>
// Invoices that took some money but not all, oldest touched first: a part payment that has
// sat longest is the one going stale.
import { computed } from 'vue'
import AppList from 'components/app/AppList.vue'
import { useInvoiceIndexContext } from 'src/_ui/AQL/composables/Operation/OutletConsumptionInvoices/Index/useInvoiceIndexContext'
import { invoiceDueRowPreset } from 'src/_ui/AQL/composables/Operation/OutletConsumptionInvoices/Index/useInvoiceRowPresets'

defineOptions({ name: 'OutletConsumptionInvoicesListPartiallyPaid', inheritAttrs: false })

const { storedViews, openInvoice } = useInvoiceIndexContext()

const preset = computed(() => invoiceDueRowPreset(storedViews.value.PartiallyPaid, { short: true, chipColor: 'info' }))

const onOpen = (item) => openInvoice(item?.code)
</script>
