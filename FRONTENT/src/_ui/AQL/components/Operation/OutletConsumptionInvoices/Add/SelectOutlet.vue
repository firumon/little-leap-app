<template>
  <div v-if="visible" :class="gutterClass">
    <SectionDividerLabel label="OUTLET" />

    <q-card flat bordered :class="ui.cardClass">
      <q-card-section :class="gutterClass">
        <component
          :is="SelectField"
          :model-value="outletCode"
          :record="{}"
          :config="{ options: outletOptions, label: 'Outlet', clearable: false }"
          header="OutletCode"
          @update:model-value="selectOutlet"
        />

        <!-- One tap for the outlets that actually have something to bill. A shortcut,
             never the only way in. -->
        <template v-if="suggestions.length">
          <div class="text-caption text-grey-7">Waiting to be billed</div>
          <div class="row q-gutter-xs">
            <q-chip
              v-for="suggestion in suggestions"
              :key="suggestion.code"
              clickable
              :outline="suggestion.code !== outletCode"
              color="primary"
              :text-color="suggestion.code === outletCode ? 'white' : undefined"
              icon="storefront"
              :label="`${suggestion.label} (${suggestion.count})`"
              @click="selectOutlet(suggestion.code)"
            />
          </div>
        </template>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
// Step 1 - which outlet. Writing the column is the whole job: Layer 2 picks the price list,
// the due date, and clears whatever the last outlet had.
import { computed, nextTick, onMounted, useAttrs } from 'vue'
import SectionDividerLabel from 'components/shared/SectionDividerLabel.vue'
import { resolveFieldComponent } from 'src/_fields/useFieldResolver'
import { applyInvoiceOutlet } from 'src/_resource/Operation/OutletConsumptionInvoices/composables/useInvoiceDraft'
import {
  useInvoiceAddContext,
  NODE,
  WIZARD_RESOURCES,
  stepVisible
} from 'src/_ui/AQL/composables/Operation/OutletConsumptionInvoices/Add/useInvoiceAddContext'

defineOptions({ name: 'OutletConsumptionInvoicesAddSelectOutlet', inheritAttrs: false })

const props = defineProps({ step: { type: [Number, String], default: 1 } })

const SUGGESTION_LIMIT = 15

const attrs = useAttrs()
const gutterClass = computed(() => `q-gutter-y-${attrs.gutter || 'sm'}`)

const { pageState, ui, query, outletOptions, index, resource } = useInvoiceAddContext()

const SelectField = resolveFieldComponent('select', 'add')

// Every resource the three steps read, opened once here so no later card fetches.
const resources = WIZARD_RESOURCES.map((name) => resource(name))

const visible = computed(() => stepVisible(pageState, props.step))

const text = (value) => (value == null ? '' : String(value).trim())

const outletCode = computed(() => text(pageState.getRecord('OutletCode', NODE)))

const suggestions = computed(() => index.invoiceableOutlets.value
  .slice(0, SUGGESTION_LIMIT)
  .map((entry) => ({
    code: text(entry.outletCode),
    label: text(entry.outletName) || text(entry.outletCode),
    count: entry.consumptionCount
  })))

const selectOutlet = (value) => pageState.setRecord('OutletCode', text(value), NODE)

// The deep-linked answers are re-applied AFTER the fetch: the page contract seeds them
// before the store has the outlet's rule or the consumption's items, so the defaults and
// the lines would come out of an empty store.
onMounted(async () => {
  await Promise.all(resources.map((entry) => entry.reload()))

  const seeded = text(query.value.outletCode) || outletCode.value
  if (!seeded) return
  if (seeded === outletCode.value) applyInvoiceOutlet(seeded, pageState)
  else selectOutlet(seeded)
  await nextTick()

  const seededConsumption = text(query.value.consumptionCode)
  if (seededConsumption) pageState.setRecord('OutletConsumptionCode', seededConsumption, NODE)
})
</script>
