<template>
  <div :class="gutterClass">
    <SectionDividerLabel label="CANCELLATION REASON" />

    <q-card flat bordered :class="ui.cardClass">
      <q-card-section>
        <component
          :is="TextareaField"
          :model-value="comment"
          :record="{}"
          :config="{ label: 'Cancellation Comment *', required: true }"
          header="ProgressCancelledComment"
          :disable="!eligible"
          @update:model-value="(value) => (comment = value)"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
// Cancel > why. The reason is written straight onto the live node, and Layer 2 re-cuts the
// batch around it, so submit sends what this box says.
import { computed, useAttrs } from 'vue'
import SectionDividerLabel from 'components/shared/SectionDividerLabel.vue'
import { resolveFieldComponent } from 'src/_fields/useFieldResolver'
import { useInvoiceCancelContext } from 'src/_ui/AQL/composables/Operation/OutletConsumptionInvoices/Cancel/useInvoiceCancelContext'

defineOptions({ name: 'OutletConsumptionInvoicesCancelCancelReason', inheritAttrs: false })

const attrs = useAttrs()
const gutterClass = computed(() => `q-gutter-y-${attrs.gutter || 'sm'}`)

const { ui, comment, eligible } = useInvoiceCancelContext()

const TextareaField = resolveFieldComponent('textarea', 'add')
</script>
