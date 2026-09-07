<template>
  <div v-if="visible && outletCode" :class="gutterClass">
    <SectionDividerLabel label="INVOICE TERMS" />

    <q-card flat bordered :class="ui.cardClass">
      <q-card-section :class="gutterClass">
        <component
          :is="SelectField"
          :model-value="priceListCode"
          :record="{}"
          :config="{ options: priceListOptions, label: 'Price List', clearable: false }"
          header="PriceListCode"
          @update:model-value="(value) => (priceListCode = value)"
        />

        <component
          :is="DateField"
          :model-value="dueDate"
          :record="{}"
          :config="{ label: 'Due date', clearable: false }"
          header="DueDate"
          @update:model-value="(value) => (dueDate = value)"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
// Step 1 - the terms the bill is raised on. Both are filled by Layer 2 from the outlet's
// operating rule the moment the outlet is picked, and both stay editable.
import { computed, useAttrs } from 'vue'
import SectionDividerLabel from 'components/shared/SectionDividerLabel.vue'
import { resolveFieldComponent } from 'src/_fields/useFieldResolver'
import {
  useInvoiceAddContext,
  NODE,
  stepVisible
} from 'src/_ui/AQL/composables/Operation/OutletConsumptionInvoices/Add/useInvoiceAddContext'

defineOptions({ name: 'OutletConsumptionInvoicesAddInvoiceBasic', inheritAttrs: false })

const props = defineProps({ step: { type: [Number, String], default: 1 } })

const attrs = useAttrs()
const gutterClass = computed(() => `q-gutter-y-${attrs.gutter || 'sm'}`)

const { pageState, ui, priceListOptions } = useInvoiceAddContext()

const SelectField = resolveFieldComponent('select', 'add')
const DateField = resolveFieldComponent('date', 'add')

const visible = computed(() => stepVisible(pageState, props.step))

const text = (value) => (value == null ? '' : String(value).trim())

const outletCode = computed(() => text(pageState.getRecord('OutletCode', NODE)))
const priceListCode = pageState.useRecord('PriceListCode', NODE)
const dueDate = pageState.useRecord('DueDate', NODE)

const priceListHint = 'From this outlet’s operating rule, or the default.'
const dueDateHint = 'From this outlet’s payment terms.'
</script>
