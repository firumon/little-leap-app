<template>
  <div v-if="live" :class="gutterClass">
    <SectionDividerLabel label="BILLING SUMMARY" />

    <q-card flat bordered :class="ui.cardClass">
      <q-card-section class="q-py-sm">
        <div class="aql-detail-grid">
          <div v-for="line in summary" :key="line.key" class="aql-detail-line">
            <div class="aql-detail-key">{{ line.label }}</div>
            <div class="aql-detail-val" :class="line.negative ? 'text-negative' : ''">
              {{ line.negative ? '−' : '' }}{{ money(line.value) }}
            </div>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="row items-center justify-between q-py-sm">
        <div class="text-subtitle2 text-weight-bold">Net Payable</div>
        <div class="text-h6 text-weight-bolder text-primary">{{ money(netPayable) }}</div>
      </q-card-section>

      <template v-if="moved">
        <q-separator />
        <q-card-section class="row items-center justify-between q-py-sm">
          <div class="text-caption text-grey-8">Was {{ money(issuedTotal) }}</div>
          <q-chip dense square outline :color="delta > 0 ? 'orange-9' : 'positive'" class="q-my-none">
            {{ delta > 0 ? '+' : '−' }}{{ money(Math.abs(delta)) }}
          </q-chip>
        </q-card-section>
      </template>
    </q-card>

    <template v-if="taxBreakdown.length">
      <SectionDividerLabel label="TAX SUMMARY" />

      <q-card flat bordered :class="ui.cardClass">
        <q-card-section class="q-py-sm">
          <div class="aql-detail-grid">
            <div v-for="entry in taxBreakdown" :key="entry.TaxCode" class="aql-detail-line">
              <div class="aql-detail-key">{{ entry.TaxCode }} on {{ money(entry.TaxableAmount) }}</div>
              <div class="aql-detail-val">{{ money(entry.TaxAmount) }}</div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </template>
  </div>
</template>

<script setup>
// Every figure is read straight off the live node, which Layer 2 re-prices on each answer,
// so the screen and the batch cannot disagree.
import { computed, useAttrs } from 'vue'
import SectionDividerLabel from 'components/shared/SectionDividerLabel.vue'
import { useInvoiceEditContext } from 'src/_ui/AQL/composables/Operation/OutletConsumptionInvoices/Edit/useInvoiceEditContext'

defineOptions({ name: 'OutletConsumptionInvoicesEditInvoiceSummary', inheritAttrs: false })

const attrs = useAttrs()
const gutterClass = computed(() => `q-gutter-y-${attrs.gutter || 'sm'}`)

const {
  ui, money, live, form, taxBreakdown, netPayable, issuedTotal, discountPreTax
} = useInvoiceEditContext()

const num = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0)

const delta = computed(() => netPayable.value - issuedTotal.value)
const moved = computed(() => Math.abs(delta.value) >= 0.005)

const summary = computed(() => {
  const entry = form.value

  return [
    { key: 'subtotal', label: 'Subtotal', value: num(entry.Subtotal) },
    {
      // Under PRE_TAX the discount is already inside each line's taxable amount, so the
      // label says where it went rather than implying a second deduction.
      key: 'discount',
      label: discountPreTax.value ? 'Discount (applied to line items)' : 'Discount',
      value: num(entry.Discount),
      negative: num(entry.Discount) > 0
    },
    { key: 'taxable', label: 'Taxable Amount', value: num(entry.TotalTaxableAmount) },
    { key: 'tax', label: 'Tax Amount', value: num(entry.TotalTaxAmount) },
    {
      key: 'returns',
      label: 'Returns Credited',
      value: num(entry.ReturnDeductionTotal),
      negative: num(entry.ReturnDeductionTotal) > 0
    }
  ]
})
</script>
