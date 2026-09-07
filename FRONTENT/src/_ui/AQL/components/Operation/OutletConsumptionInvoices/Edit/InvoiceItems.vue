<template>
  <div v-if="live" :class="gutterClass">
    <SectionDividerLabel label="BILLED ITEMS" />

    <q-card flat bordered :class="ui.cardClass">
      <q-list separator>
        <q-item v-for="line in lines" :key="line.sku">
          <q-item-section :class="ui.flexWrapTextClass">
            <q-item-label class="text-weight-medium">{{ line.qty }} x {{ line.product }}</q-item-label>
            <q-item-label caption>{{ line.variant }}</q-item-label>
            <q-item-label v-if="line.changed" caption class="text-orange-9">
              was {{ money(line.basePrice) }}
              <q-btn
                flat dense no-caps
                size="sm"
                color="primary"
                label="Restore"
                class="q-ml-xs q-px-xs"
                :disable="locked"
                :aria-label="`Restore the original price for ${line.product}`"
                @click="restoreLinePrice(line.at)"
              />
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <div style="width: 104px">
              <component
                :is="CurrencyField"
                :model-value="line.price"
                :record="{}"
                :config="priceConfig"
                header="Price"
                @update:model-value="(value) => setLinePrice(line.at, value)"
              />
            </div>
          </q-item-section>
        </q-item>
      </q-list>

      <template v-if="lines.length">
        <q-separator />
        <q-card-section class="row items-center justify-between q-py-sm">
          <div class="text-caption text-grey-8">
            {{ lines.length }} line{{ lines.length === 1 ? '' : 's' }}
            <span v-if="changedCount"> · {{ changedCount }} re-priced</span>
          </div>
          <div class="text-subtitle2 text-weight-bold">{{ money(subtotal) }}</div>
        </q-card-section>
      </template>
    </q-card>
  </div>
</template>

<script setup>
// Quantity is a fact of the bill and stays locked. Only the unit price is editable, and it
// is written straight onto the live child row.
import { computed, useAttrs } from 'vue'
import SectionDividerLabel from 'components/shared/SectionDividerLabel.vue'
import { resolveFieldComponent } from 'src/_fields/useFieldResolver'
import { useInvoiceEditContext } from 'src/_ui/AQL/composables/Operation/OutletConsumptionInvoices/Edit/useInvoiceEditContext'

defineOptions({ name: 'OutletConsumptionInvoicesEditInvoiceItems', inheritAttrs: false })

const attrs = useAttrs()
const gutterClass = computed(() => `q-gutter-y-${attrs.gutter || 'sm'}`)

const CurrencyField = resolveFieldComponent('currency', 'edit')

const {
  ui, money, live, locked, lines, form, setLinePrice, restoreLinePrice
} = useInvoiceEditContext()

const changedCount = computed(() => lines.value.filter((line) => line.changed).length)
const subtotal = computed(() => Number(form.value.Subtotal) || 0)

// Memoised: a fresh literal per render re-runs the control's watchers on every keystroke.
const priceConfig = computed(() => ({
  label: 'Unit price',
  min: 0,
  hideBottomSpace: true,
  inputClass: 'text-right text-weight-bold',
  disable: locked.value
}))
</script>
