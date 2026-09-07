<template>
  <div v-if="visible" :class="gutterClass">
    <SectionDividerLabel label="ITEMS TO BILL" />

    <!-- An invoice raised WITHOUT a consumption behind it bills the outlet but changes no
         shelf: there was no count to deduct. Said only when it applies. -->
    <q-banner v-if="isDirectInvoice" dense rounded class="bg-orange-1 text-body2">
      <template #avatar><q-icon name="warning" color="warning" /></template>
      Creating an invoice directly without a consumption will not record any outlet or
      warehouse stock movements.
    </q-banner>

    <q-card flat bordered :class="ui.cardClass">
      <q-card-section v-if="!lines.length" class="text-center q-py-lg">
        <q-icon name="receipt_long" :size="ui.emptyIconSize" :color="ui.emptyIconColor" class="q-mb-sm block q-mx-auto" />
        <div :class="ui.emptyTitleClass">Nothing to bill</div>
        <div :class="ui.emptyCaptionClass">Add an item below, or go back and tick a consumption.</div>
      </q-card-section>

      <q-list v-else separator>
        <q-item v-for="line in lines" :key="line.SKU">
          <q-item-section :class="ui.flexWrapTextClass">
            <q-item-label class="text-weight-medium">{{ line.Qty }} x {{ line.primary }}</q-item-label>
            <q-item-label caption>{{ line.secondary }}</q-item-label>
            <!-- With ONE consumption ticked every line came from it, so a source line under
                 each row tells the reader nothing. -->
            <q-item-label
              v-for="source in (showSources ? line.sources : [])"
              :key="source.key"
              caption
            >
              {{ source.label }}
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <div class="row items-center no-wrap q-gutter-x-sm">
              <div style="width: 72px">
                <component
                  :is="NumberField"
                  :model-value="line.Qty"
                  :record="line"
                  :config="{ dense: true, inputClass: 'text-center' }"
                  header="Qty"
                  @update:model-value="(value) => setLine(line.at, 'Qty', value)"
                />
              </div>
              <div style="width: 96px">
                <component
                  :is="CurrencyField"
                  :model-value="line.Price"
                  :record="line"
                  :config="{ label: 'Unit price', inputClass: 'text-right text-weight-bold' }"
                  header="Price"
                  @update:model-value="(value) => setLine(line.at, 'Price', value)"
                />
              </div>
              <!-- Only a hand-added line goes. A counted quantity is a fact; untick the
                   consumption instead. -->
              <q-btn
                v-if="line.manual"
                flat round dense
                icon="close"
                color="negative"
                :aria-label="`Remove ${line.primary}`"
                @click="removeLine(line.at)"
              />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>

    <!-- The SHARED drawer, the same control the consumption wizard uses, so "add another
         item" is one recurring pattern rather than three similar ones. -->
    <AqlAddItemsExpansion
      :items="visibleCandidates"
      label="Add more items"
      search-label="Search items to bill"
      :caption="`${candidates.length} more item(s) available`"
      :card-class="ui.cardClass + ' q-py-sm'"
    >
      <template #row="{ option }">
        <div class="row items-center no-wrap q-gutter-x-sm">
          <div style="width: 72px">
            <component
              :is="NumberField"
              :model-value="pendingQty[option.value] ?? 1"
              :record="{}"
              :config="{ dense: true, inputClass: 'text-center' }"
              header="Qty"
              @update:model-value="(value) => (pendingQty[option.value] = value)"
            />
          </div>
          <q-btn
            dense round no-caps
            color="primary"
            icon="add"
            :aria-label="`Add ${option.primary} to the invoice`"
            @click="addItem(option.value)"
          />
        </div>
      </template>
    </AqlAddItemsExpansion>
  </div>
</template>

<script setup>
// Step 2 - the bill's lines and their prices. Ticked counts arrive grouped one row per SKU.
// A typed price is stored ON the line, and Layer 2 re-prices tax, discount and the payable
// around it.
import { computed, reactive, useAttrs } from 'vue'
import SectionDividerLabel from 'components/shared/SectionDividerLabel.vue'
import AqlAddItemsExpansion from 'components/shared/AqlAddItemsExpansion.vue'
import { resolveFieldComponent } from 'src/_fields/useFieldResolver'
import {
  useInvoiceAddContext,
  NODE,
  ITEMS,
  stepVisible
} from 'src/_ui/AQL/composables/Operation/OutletConsumptionInvoices/Add/useInvoiceAddContext'

defineOptions({ name: 'OutletConsumptionInvoicesAddInvoiceItems', inheritAttrs: false })

const props = defineProps({ step: { type: [Number, String], default: 2 } })

const CANDIDATE_LIMIT = 25

const attrs = useAttrs()
const gutterClass = computed(() => `q-gutter-y-${attrs.gutter || 'sm'}`)

const { pageState, ui, skuLabelOf, skuCandidatesFor } = useInvoiceAddContext()

const NumberField = resolveFieldComponent('number', 'add')
const CurrencyField = resolveFieldComponent('currency', 'add')

const visible = computed(() => stepVisible(pageState, props.step))

const text = (value) => (value == null ? '' : String(value).trim())
const num = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0)

const node = pageState.useNode(NODE)

const lines = computed(() => {
  void node.value
  return pageState.getChildRows(ITEMS, NODE).map((row, at) => {
    const label = skuLabelOf(row.SKU)
    return {
      at,
      SKU: text(row.SKU),
      Qty: num(row.Qty),
      Price: num(row.Price),
      sources: Array.isArray(row._sources) ? row._sources : [],
      manual: row._manual === true,
      primary: label.primary,
      secondary: label.secondary
    }
  })
})

// Nothing counted behind this bill, so no stock anywhere moves. The banner says so.
const isDirectInvoice = computed(() =>
  !text(pageState.getRecord('OutletConsumptionCode', NODE)))

// With one count ticked every line came from it, so naming the source says nothing.
const showSources = computed(() =>
  text(pageState.getRecord('OutletConsumptionCode', NODE)).split(',').filter(Boolean).length > 1)

const candidates = computed(() => skuCandidatesFor('', lines.value.map((line) => line.SKU)))
const visibleCandidates = computed(() => candidates.value.slice(0, CANDIDATE_LIMIT))

const pendingQty = reactive({})

const setLine = (at, key, value) => pageState.setChildren(ITEMS, at, key, num(value), NODE)

const removeLine = (at) => pageState.removeChild(ITEMS, at, NODE)

function addItem (sku) {
  const code = text(sku)
  const qty = num(pendingQty[code] ?? 1)
  if (!code || qty <= 0) return
  pageState.addChild(ITEMS, { SKU: code, Qty: qty, _manual: true, _sources: [] }, NODE)
  delete pendingQty[code]
}
</script>
