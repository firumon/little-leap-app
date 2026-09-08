<template>
  <AppList
    :items="rows"
    item-key="outletCode"
    empty-text="No outlet is carrying a balance."
    empty-icon="storefront"
    :layout="['label', 'caption', 'caption']"
    :content="content"
    :meta-layout="['label']"
    :meta-label="balanceOf"
  />
</template>

<script setup>
// One row per outlet, heaviest debtor first. Not clickable: an outlet is not a record this
// resource can open.
import { computed } from 'vue'
import AppList from 'components/app/AppList.vue'
import { useInvoiceIndexContext } from 'src/_ui/AQL/composables/Operation/OutletConsumptionInvoices/Index/useInvoiceIndexContext'
import { elapsedLabel } from 'src/_ui/AQL/composables/Operation/OutletConsumptionInvoices/Index/useInvoiceRowPresets'

defineOptions({ name: 'OutletConsumptionInvoicesListOutletPendings', inheritAttrs: false })

const { outletPendings, filterInvoices, money } = useInvoiceIndexContext()

const rows = computed(() => filterInvoices(outletPendings.value).map((entry) => ({
  outletCode: entry.outletCode,
  outletName: entry.outletName,
  invoiceCount: entry.invoiceCount,
  overdueCount: entry.overdueCount,
  oldestDate: entry.oldestDate,
  balance: entry.balance
})))

const countsOf = (row) => {
  const invoices = `${row.invoiceCount} Invoice${row.invoiceCount === 1 ? '' : 's'}`
  return `${invoices} · ${row.overdueCount} Overdue`
}

const sinceOf = (row) => {
  if (!row.oldestDate) return ''
  const age = elapsedLabel(row.oldestDate)
  return age ? `Since: ${row.oldestDate} (${age})` : `Since: ${row.oldestDate}`
}

const content = [
  (row) => row.outletName,
  countsOf,
  sinceOf
]

const balanceOf = (item) => money(item.balance)
</script>
