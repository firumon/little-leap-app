// The invoice's line rows. Their SHAPE lived in OutletConsumptions, which does not own
// them - a consumption discovers what is billable, an invoice item states what was billed.

export const RESOURCE_NAME = 'OutletConsumptionInvoiceItems'

// A calculated line minus the engine's working fields. `TaxParts` is the per-component
// detail the header already carries grouped, and `Unpriced` is a flag, not a column.
export function invoiceItemOf (line) {
  const { TaxParts, Unpriced, ...record } = (line && typeof line === 'object' ? line : {})
  return record
}

// One sheet row. The parent code is NOT set here: a composite save fills it in from the
// invoice it just wrote, so no caller has to hold a code that does not exist yet.
export function invoiceItemRow (line) {
  return { ...invoiceItemOf(line), Status: 'Active' }
}

// The `children` bucket an invoice carries. A list, never a node: these rows are written
// inside the parent's composite. No bucket when empty, so a merge cannot wipe live lines.
export function nodePayloadForParent (lines = []) {
  const records = (Array.isArray(lines) ? lines : []).filter(Boolean).map(invoiceItemRow)
  return records.length ? [{ resource: RESOURCE_NAME, records }] : []
}

export function useInvoiceItemPayload () {
  return {
    RESOURCE_NAME,
    invoiceItemOf,
    invoiceItemRow,
    nodePayloadForParent
  }
}
