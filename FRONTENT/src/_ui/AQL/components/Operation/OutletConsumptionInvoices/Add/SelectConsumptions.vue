<template>
  <div v-if="visible && outletCode" :class="gutterClass">
    <SectionDividerLabel label="UNBILLED CONSUMPTIONS" />

    <q-card flat bordered :class="ui.cardClass">
      <q-card-section v-if="!entries.length" class="text-center q-py-lg">
        <q-icon name="fact_check" :size="ui.emptyIconSize" :color="ui.emptyIconColor" class="q-mb-sm block q-mx-auto" />
        <div :class="ui.emptyTitleClass">Nothing to bill</div>
        <div :class="ui.emptyCaptionClass">
          This outlet has no unbilled consumptions. You can still continue and add items by
          hand on the next step.
        </div>
      </q-card-section>

      <q-list v-else separator>
        <q-item v-for="entry in entries" :key="entry.code" v-ripple tag="label" clickable>
          <q-item-section side top>
            <q-checkbox v-model="selected" :val="entry.code" />
          </q-item-section>

          <q-item-section :class="ui.flexWrapTextClass">
            <q-item-label class="text-weight-medium">{{ entry.date }}</q-item-label>
            <q-item-label caption>{{ entry.username || '—' }} · {{ entry.code }}</q-item-label>
            <q-item-label caption>
              {{ entry.itemCount }} item{{ entry.itemCount === 1 ? '' : 's' }} ·
              {{ entry.totalQty }} qty
              <span v-if="entry.daysSince !== null"> · {{ entry.daysSince }}d ago</span>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </div>
</template>

<script setup>
// Step 1 - which counts to bill. Ticking is optional: an invoice may bill something that
// was never counted, and step 2 is where the lines are settled.
import { computed, useAttrs } from 'vue'
import SectionDividerLabel from 'components/shared/SectionDividerLabel.vue'
import { invoiceableConsumptionsOf } from 'src/_resource/Operation/OutletConsumptionInvoices/composables/useInvoiceDraft'
import {
  useInvoiceAddContext,
  NODE,
  stepVisible
} from 'src/_ui/AQL/composables/Operation/OutletConsumptionInvoices/Add/useInvoiceAddContext'

defineOptions({ name: 'OutletConsumptionInvoicesAddSelectConsumptions', inheritAttrs: false })

const props = defineProps({ step: { type: [Number, String], default: 1 } })

const attrs = useAttrs()
const gutterClass = computed(() => `q-gutter-y-${attrs.gutter || 'sm'}`)

const { pageState, ui } = useInvoiceAddContext()

const visible = computed(() => stepVisible(pageState, props.step))

const text = (value) => (value == null ? '' : String(value).trim())
const num = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0)

const outletCode = computed(() => text(pageState.getRecord('OutletCode', NODE)))

function daysSince (iso) {
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return null
  return Math.round((Date.now() - date.getTime()) / 86400000)
}

const entries = computed(() => invoiceableConsumptionsOf(outletCode.value).map((entry) => ({
  ...entry,
  itemCount: entry.items.length,
  totalQty: entry.items.reduce((sum, item) => sum + num(item.Qty), 0),
  daysSince: daysSince(entry.date)
})))

// The ticks ARE the record's own column. `q-checkbox` mutates its array in place, so the
// setter re-wraps it or the write never lands.
const selected = computed({
  get: () => text(pageState.getRecord('OutletConsumptionCode', NODE)).split(',').map(text).filter(Boolean),
  set: (value) => pageState.setRecord('OutletConsumptionCode',
    (value || []).map(text).filter(Boolean).join(','), NODE)
})
</script>
