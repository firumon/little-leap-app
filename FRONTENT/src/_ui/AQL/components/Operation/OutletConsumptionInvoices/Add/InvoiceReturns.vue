<template>
  <div v-if="visible && entries.length" :class="gutterClass">
    <SectionDividerLabel label="CREDITED RETURNS" />

    <q-card flat bordered :class="ui.cardClass">
      <q-card-section>
        <!-- OPT-IN. Whether a credit belongs on THIS invoice is a commercial call, and
             applying it silently also closes the return without the user's agreement. -->
        <div class="row items-center no-wrap q-col-gutter-sm">
          <div class="col" :class="ui.flexWrapTextClass">
            <div class="text-subtitle1 text-weight-medium">Credit pending returns</div>
            <div class="text-caption text-grey-8">
              {{ entries.length }} return{{ entries.length === 1 ? '' : 's' }}
              awaiting adjustment for this outlet.
            </div>
          </div>
          <div class="col-auto">
            <q-toggle v-model="applyReturns" color="primary" />
          </div>
        </div>
      </q-card-section>

      <template v-if="applyReturns">
        <q-separator />
        <q-list separator>
          <q-item v-for="entry in entries" :key="entry.code" v-ripple tag="label" clickable>
            <q-item-section side top>
              <q-checkbox v-model="chosen" :val="entry.code" />
            </q-item-section>

            <q-item-section :class="ui.flexWrapTextClass">
              <q-item-label class="text-weight-medium">{{ entry.qty }} x {{ entry.primary }}</q-item-label>
              <q-item-label caption>{{ entry.secondary }}</q-item-label>
              <q-item-label caption>
                {{ entry.date }}
                <span v-if="entry.reason"> · {{ entry.reason }}</span>
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-chip dense square outline color="blue-8" class="q-my-none">
                {{ money(entry.amount) }}
              </q-chip>
            </q-item-section>
          </q-item>
        </q-list>
      </template>
    </q-card>
  </div>
</template>

<script setup>
// Step 3 - which credited returns come off this bill. The tick list is the record's own
// column; Layer 2 turns it into the deduction and the returns the batch closes.
import { computed, useAttrs } from 'vue'
import SectionDividerLabel from 'components/shared/SectionDividerLabel.vue'
import { creditableReturnsOf } from 'src/_resource/Operation/OutletConsumptionInvoices/composables/useInvoiceDraft'
import {
  useInvoiceAddContext,
  NODE,
  CTRL,
  stepVisible
} from 'src/_ui/AQL/composables/Operation/OutletConsumptionInvoices/Add/useInvoiceAddContext'

defineOptions({ name: 'OutletConsumptionInvoicesAddInvoiceReturns', inheritAttrs: false })

const props = defineProps({ step: { type: [Number, String], default: 3 } })

const attrs = useAttrs()
const gutterClass = computed(() => `q-gutter-y-${attrs.gutter || 'sm'}`)

const { pageState, ui, money, skuLabelOf } = useInvoiceAddContext()

const visible = computed(() => stepVisible(pageState, props.step))

const text = (value) => (value == null ? '' : String(value).trim())
const num = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0)

const outletCode = computed(() => text(pageState.getRecord('OutletCode', NODE)))

const entries = computed(() => creditableReturnsOf(outletCode.value).map((row) => {
  const label = skuLabelOf(row.SKU)
  return {
    code: text(row.Code),
    date: text(row.Date),
    qty: num(row.Qty),
    amount: num(row.Qty) * num(row.Price),
    reason: text(row.Reason),
    primary: label.primary,
    secondary: label.secondary
  }
}))

const applyReturns = computed({
  get: () => pageState.getControls(CTRL.APPLY_RETURNS, false, NODE) === true,
  set: (value) => pageState.setControls(CTRL.APPLY_RETURNS, value === true, NODE)
})

const chosen = computed({
  get: () => text(pageState.getRecord('OutletReturnCodes', NODE)).split(',').map(text).filter(Boolean),
  set: (value) => pageState.setRecord('OutletReturnCodes',
    (value || []).map(text).filter(Boolean).join(','), NODE)
})
</script>
