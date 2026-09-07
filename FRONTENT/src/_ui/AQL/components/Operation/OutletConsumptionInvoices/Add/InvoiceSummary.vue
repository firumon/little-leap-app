<template>
  <div v-if="visible" :class="gutterClass">
    <SectionDividerLabel label="INVOICE SUMMARY" />

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

      <template v-if="taxBreakdown.length">
        <q-separator />
        <q-card-section class="q-py-sm">
          <div class="aql-detail-grid">
            <div v-for="entry in taxBreakdown" :key="entry.TaxCode" class="aql-detail-line">
              <div class="aql-detail-key">{{ entry.TaxCode }} on {{ money(entry.TaxableAmount) }}</div>
              <div class="aql-detail-val">{{ money(entry.TaxAmount) }}</div>
            </div>
          </div>
        </q-card-section>
      </template>

      <q-separator />

      <q-card-section class="row items-center justify-between q-py-sm">
        <div class="text-subtitle2 text-weight-bold">Net Payable</div>
        <div class="text-h6 text-weight-bolder text-primary">{{ money(netPayable) }}</div>
      </q-card-section>
    </q-card>

    <SectionDividerLabel label="NOTES" />

    <q-card flat bordered :class="ui.cardClass">
      <q-card-section>
        <component
          :is="TextareaField"
          :model-value="comment"
          :record="{}"
          :config="{ label: 'Comment (optional)' }"
          header="ProgressPendingPaymentComment"
          @update:model-value="(value) => (comment = value)"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
// Step 3 - what the bill comes to. Every figure is read straight off the live node, which
// Layer 2 re-prices on each answer, so the screen and the batch cannot disagree.
import { computed, useAttrs } from 'vue'
import SectionDividerLabel from 'components/shared/SectionDividerLabel.vue'
import { resolveFieldComponent } from 'src/_fields/useFieldResolver'
import {
  grandTotalOf,
  storedTaxBreakdown,
  invoicePolicyOf,
  PRE_TAX
} from 'src/_resource/Operation/OutletConsumptionInvoices/composables/useInvoiceCalculation'
import {
  useInvoiceAddContext,
  NODE,
  stepVisible
} from 'src/_ui/AQL/composables/Operation/OutletConsumptionInvoices/Add/useInvoiceAddContext'

defineOptions({ name: 'OutletConsumptionInvoicesAddInvoiceSummary', inheritAttrs: false })

const props = defineProps({ step: { type: [Number, String], default: 3 } })

const attrs = useAttrs()
const gutterClass = computed(() => `q-gutter-y-${attrs.gutter || 'sm'}`)

const { pageState, ui, money } = useInvoiceAddContext()

const TextareaField = resolveFieldComponent('textarea', 'add')

const visible = computed(() => stepVisible(pageState, props.step))

const num = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0)

const record = computed(() => pageState.getRecord(null, NODE) || {})
const comment = pageState.useRecord('ProgressPendingPaymentComment', NODE)

const taxBreakdown = computed(() => storedTaxBreakdown(record.value))
const netPayable = computed(() => grandTotalOf(record.value))

const summary = computed(() => {
  const entry = record.value
  // Under PRE_TAX the discount is already inside each line's taxable amount, so the label
  // says where it went rather than implying a second deduction.
  const preTax = invoicePolicyOf(entry.PriceListCode).discountTaxPolicy === PRE_TAX

  // Every line is stated even at zero: this is a reconciliation, and a missing row would
  // leave the reader guessing.
  return [
    { key: 'subtotal', label: 'Subtotal', value: num(entry.Subtotal) },
    {
      key: 'discount',
      label: preTax ? 'Discount (applied to line items)' : 'Discount',
      value: num(entry.Discount),
      negative: num(entry.Discount) > 0
    },
    { key: 'taxable', label: 'Taxable Amount', value: num(entry.TotalTaxableAmount) },
    { key: 'tax', label: 'Tax Amount', value: num(entry.TotalTaxAmount) },
    {
      key: 'returns',
      label: 'Returns Deducted',
      value: num(entry.ReturnDeductionTotal),
      negative: num(entry.ReturnDeductionTotal) > 0
    }
  ]
})
</script>
