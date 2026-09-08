<template>
  <AppList
    v-bind="preset"
    empty-text="No invoices yet."
    empty-icon="history"
    @click="onOpen"
  />
</template>

<script setup>
// The page's default view: what moved lately, newest touched first, capped at 50. Cancelled
// rows are in on purpose — a cancellation is a move.
import { computed } from 'vue'
import AppList from 'components/app/AppList.vue'
import { useInvoiceIndexContext } from 'src/_ui/AQL/composables/Operation/OutletConsumptionInvoices/Index/useInvoiceIndexContext'
import { invoiceRecentRowPreset } from 'src/_ui/AQL/composables/Operation/OutletConsumptionInvoices/Index/useInvoiceRowPresets'

defineOptions({ name: 'OutletConsumptionInvoicesListRecent', inheritAttrs: false })

const { storedViews, filterInvoices, openInvoice } = useInvoiceIndexContext()

const preset = computed(() => invoiceRecentRowPreset(filterInvoices(storedViews.value.Recent)))

const onOpen = (item) => openInvoice(item?.code)
</script>
