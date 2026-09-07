<template>
  <div :class="gutterClass">
    <SectionDividerLabel label="SETTLEMENT DECISION" />

    <!-- THE ONLY ACCENTED CARD ON THE PAGE. Closing a bill for less than it billed is a
         decision, not a formality. -->
    <q-card flat bordered :class="[ui.cardClass, ui.accentCardClass]" :style="ui.accentBorderStyle">
      <q-card-section :class="gutterClass">
        <div class="text-subtitle1 text-weight-medium">Why is the difference accepted?</div>
        <div class="text-caption text-grey-8 q-pb-sm">
          The reason and the amount are stamped onto the invoice and are what a write-off
          report is filtered by.
        </div>

        <component
          :is="SelectField"
          :model-value="reason"
          :record="{}"
          :config="{ options: reasons, label: 'Settlement reason', required: true, clearable: false }"
          header="SettlementReason"
          :disable="!gate.allowed"
          @update:model-value="(value) => (reason = value)"
        />

        <component
          :is="CurrencyField"
          :model-value="mismatch"
          :record="{}"
          :config="{ label: 'Amount written off' }"
          header="SettlementMismatchAmount"
          :disable="!gate.allowed"
          @update:model-value="(value) => (mismatch = value)"
        />

        <div class="text-caption text-grey-8">{{ mismatchNote }}</div>

        <component
          :is="TextareaField"
          :model-value="comment"
          :record="{}"
          :config="{ label: commentRequired ? 'Explanation (required)' : 'Settlement note', required: commentRequired }"
          header="ProgressPaidComment"
          :disable="!gate.allowed"
          @update:model-value="(value) => (comment = value)"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
// Settle > naming the gap. Each field is written straight onto the standing record node, so
// the screen and the sheet cannot disagree.
import { computed, useAttrs } from 'vue'
import SectionDividerLabel from 'components/shared/SectionDividerLabel.vue'
import { resolveFieldComponent } from 'src/_fields/useFieldResolver'
import { useInvoiceSettleContext } from 'src/_ui/AQL/composables/Operation/OutletConsumptionInvoices/SettleInvoice/useInvoiceSettleContext'

defineOptions({ name: 'OutletConsumptionInvoicesSettleInvoiceSettlementReason', inheritAttrs: false })

const attrs = useAttrs()
const gutterClass = computed(() => `q-gutter-y-${attrs.gutter || 'sm'}`)

const {
  ui, gate, money, reasons, reason, mismatch, comment, commentRequired
} = useInvoiceSettleContext()

// `'add'`, because the mode follows the VALUE rather than the page: none of these answers
// exists yet.
const SelectField = resolveFieldComponent('select', 'add')
const CurrencyField = resolveFieldComponent('currency', 'add')
const TextareaField = resolveFieldComponent('textarea', 'add')

const mismatchNote = computed(() => {
  const raw = mismatch.value
  const balance = gate.value.balance
  if (raw === undefined || raw === null || raw === '') {
    return `Blank writes off the whole outstanding ${money(balance)}.`
  }
  const entered = Number(raw) || 0
  if (entered >= balance) return 'The whole outstanding balance is written off.'
  return `${money(entered)} written off, ${money(balance - entered)} treated as collected.`
})
</script>
