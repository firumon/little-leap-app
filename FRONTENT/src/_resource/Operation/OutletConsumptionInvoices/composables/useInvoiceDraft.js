// The live Add draft for OutletConsumptionInvoices. Layer 2. The wizard's nodes ARE the
// batch: the UI writes one column, the derives here regenerate every consequence, and
// submit only validates (UI_PAGE_STATE_NODES.md §5.7A–§5.7D).

import { useAuth } from 'src/composables/core/useAuth'
import { useInvoiceIndex } from './useInvoiceIndex'
import {
  resolvePriceListCode,
  invoiceDueDaysFor,
  dueDateFrom
} from './useInvoiceCalculation'
import {
  invoiceNode,
  repriceInvoiceInPageState,
  buildInvoiceGenerationNodes,
  makeInvoiceLinePriceResolver
} from './useInvoicePayload'
import { makeLineTaxResolver } from 'src/_resource/Operation/OutletConsumptions/composables/useConsumptionInvoice'

const INVOICES = 'OutletConsumptionInvoices'
const INVOICE_ITEMS = 'OutletConsumptionInvoiceItems'
const CONSUMPTIONS = 'OutletConsumptions'
const RETURNS = 'OutletReturns'
const TAX_TRANSACTIONS = 'TaxTransactions'

/** Working state only — never a sheet column. All of them live on the invoice node. */
export const INVOICE_CONTROL = {
  DISCOUNT_TYPE: 'DiscountType',
  DISCOUNT_VALUE: 'DiscountValue',
  APPLY_RETURNS: 'ApplyReturns',
  BUILD_ERROR: 'BuildError'
}

const CTL = INVOICE_CONTROL

const text = (value) => (value == null ? '' : String(value).trim())
const num = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0)
const todayISO = () => new Date().toISOString().slice(0, 10)
const csv = (value) => text(value).split(',').map(text).filter(Boolean)
const isActiveRow = (row) => text(row?.Status || 'Active').toUpperCase() === 'ACTIVE'

const record = (pageState) => pageState.getRecord(null, INVOICES) || {}
const lineRows = (pageState) => pageState.getChildRows(INVOICE_ITEMS, INVOICES) || []
const billedLines = (pageState) => lineRows(pageState).filter((row) => num(row.Qty) > 0)

const getCtl = (pageState, header, fallback = null) =>
  pageState.getControls(header, fallback, INVOICES)

const setCtl = (pageState, header, value) =>
  pageState.setControls(header, value, INVOICES)

// ─── What the outlet offers ──────────────────────────────────────────────────

/** The outlet's uninvoiced consumptions with their billable item rows, newest first. */
export function invoiceableConsumptionsOf (outletCode) {
  const outlet = text(outletCode)
  if (!outlet) return []
  const index = useInvoiceIndex()
  return index.pendingInvoiceGeneration.value
    .filter((row) => text(row.OutletCode) === outlet)
    .map((row) => ({
      code: text(row.Code),
      date: text(row.Date),
      username: text(row.Username),
      // Joined through the aggregate's indexed map: a list record carries no children.
      items: index.itemsOfConsumption(row.Code).filter(isActiveRow)
    }))
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

/** The outlet's returns still waiting to be credited on a bill. */
export function creditableReturnsOf (outletCode) {
  const outlet = text(outletCode)
  if (!outlet) return []
  return useInvoiceIndex().returnsAwaitingAdjustment.value
    .filter((row) => text(row.OutletCode) === outlet)
    .sort((a, b) => (text(a.Date) < text(b.Date) ? -1 : 1))
}

/** The raw return rows this draft credits — never a display shape, the builder reads them. */
export function creditedReturnRows (pageState) {
  if (getCtl(pageState, CTL.APPLY_RETURNS, false) !== true) return []
  const chosen = new Set(csv(record(pageState).OutletReturnCodes))
  // Intersected with what is still available: switching outlet leaves old codes behind for
  // one tick, and crediting another outlet's return is a real accounting error.
  return creditableReturnsOf(record(pageState).OutletCode)
    .filter((row) => chosen.has(text(row.Code)))
}

const deductionOf = (rows) => rows.reduce((sum, row) => sum + num(row.Qty) * num(row.Price), 0)

// ─── The derive handlers ─────────────────────────────────────────────────────

// A new outlet invalidates every answer below it, or the bill mixes two outlets.
export function applyInvoiceOutlet (outletCode, pageState) {
  const outlet = text(outletCode)
  const rules = useInvoiceIndex().operatingRules.value

  pageState.setRecord('OutletConsumptionCode', '', INVOICES)
  pageState.setRecord('OutletReturnCodes', '', INVOICES)
  setCtl(pageState, CTL.APPLY_RETURNS, false)
  clearInvoiceLines(pageState)

  if (!outlet) return
  pageState.setRecord('PriceListCode', resolvePriceListCode(outlet, rules), INVOICES)
  pageState.setRecord('DueDate', dueDateFrom(todayISO(), invoiceDueDaysFor(outlet, rules)), INVOICES)
}

function clearInvoiceLines (pageState) {
  for (let i = lineRows(pageState).length - 1; i >= 0; i--) {
    pageState.removeChild(INVOICE_ITEMS, i, INVOICES)
  }
}

const lineIndexOf = (pageState, sku) =>
  lineRows(pageState).findIndex((row) => text(row.SKU) === text(sku))

// One row per SKU: an outlet counted weekly and billed monthly gets one line per product,
// not four. `_sources` and `_manual` are frontend-only — the builder strips them.
export function seedInvoiceLines (pageState) {
  const chosen = new Set(csv(record(pageState).OutletConsumptionCode))
  const bySku = new Map()

  invoiceableConsumptionsOf(record(pageState).OutletCode).forEach((consumption) => {
    if (!chosen.has(consumption.code)) return
    consumption.items.forEach((item) => {
      const sku = text(item.SKU)
      if (!sku) return
      const qty = num(item.Qty)
      const entry = bySku.get(sku) || { Qty: 0, sources: [] }
      entry.Qty += qty
      entry.sources.push({
        key: `${consumption.code}-${sku}`,
        qty,
        label: `${qty} from ${consumption.date} (${consumption.username || '—'})`
      })
      bySku.set(sku, entry)
    })
  })

  // A hand-added row is never dropped here; only the card's own remove takes one off.
  for (let i = lineRows(pageState).length - 1; i >= 0; i--) {
    const row = lineRows(pageState)[i]
    if (row._manual) continue
    if (!bySku.has(text(row.SKU))) pageState.removeChild(INVOICE_ITEMS, i, INVOICES)
  }

  bySku.forEach((entry, sku) => {
    const at = lineIndexOf(pageState, sku)
    if (at < 0) {
      pageState.addChild(INVOICE_ITEMS, { SKU: sku, Qty: entry.Qty, _sources: entry.sources }, INVOICES)
      return
    }
    // A hand-added row that a tick now also covers keeps its own quantity on top.
    const current = lineRows(pageState)[at]
    const manual = current._manual ? num(current.Qty) : 0
    pageState.setChildren(INVOICE_ITEMS, at, null,
      { Qty: entry.Qty + manual, _sources: entry.sources }, INVOICES)
  })
}

// The returns toggle owns the whole set: on credits everything available, off clears it, so
// a re-tick never restores an abandoned selection.
export function applyReturnsToggle (value, pageState) {
  const codes = value === true
    ? creditableReturnsOf(record(pageState).OutletCode).map((row) => text(row.Code))
    : []
  pageState.setRecord('OutletReturnCodes', codes.join(','), INVOICES)
}

// How many consumption-mark nodes the last pass raised. `applyNodes` only ever adds, so
// the tail has to be taken down by name before the next pass puts it back up.
let raisedMarks = 0

function clearDependentNodes (pageState) {
  for (let i = 0; i < raisedMarks; i++) {
    pageState.removeNode(CONSUMPTIONS, `invoiceGenerated${i}`)
  }
  raisedMarks = 0
  pageState.removeNode(TAX_TRANSACTIONS)
  pageState.removeNode(RETURNS)
}

function actorName (form) {
  const { user } = useAuth()
  return text(form?.Username) || text(user.value?.name || user.value?.email)
}

// The whole draft, re-cut: every line priced, every total restated, and the dependent tail
// raised again, so the summary is exactly what submit would send.
export function syncInvoiceDraft (pageState) {
  if (!pageState.hasNode(INVOICES)) return

  const credits = creditedReturnRows(pageState)
  const deduction = deductionOf(credits)
  // Written BEFORE the reprice: the engine reads it off the record to reach the payable.
  if (num(record(pageState).ReturnDeductionTotal) !== deduction) {
    pageState.setRecord('ReturnDeductionTotal', deduction, INVOICES)
  }
  repriceInvoiceInPageState(pageState)

  clearDependentNodes(pageState)

  const form = record(pageState)
  const outlet = text(form.OutletCode)
  const lines = billedLines(pageState).map((row) => ({ SKU: text(row.SKU), Qty: num(row.Qty) }))
  if (!outlet || !lines.length) {
    // Nothing to invoice. The page's own node stays — it holds the answers — but there is
    // nothing for Layer 2 to refuse either.
    setCtl(pageState, CTL.BUILD_ERROR, '')
    return
  }

  const priceListCode = text(form.PriceListCode)
  const resolvePrice = makeInvoiceLinePriceResolver(lineRows(pageState))
  const consumptionCodes = csv(form.OutletConsumptionCode)
  const actor = actorName(form)

  const applied = pageState.applyNodes(buildInvoiceGenerationNodes({
    outletCode: outlet,
    username: actor,
    actorName: actor,
    date: text(form.Date) || todayISO(),
    dueDate: text(form.DueDate) || todayISO(),
    priceListCode,
    lines,
    consumptionCodes,
    returnRows: credits,
    discountType: text(getCtl(pageState, CTL.DISCOUNT_TYPE, 'FLAT')) || 'FLAT',
    discountValue: num(getCtl(pageState, CTL.DISCOUNT_VALUE, 0)),
    comment: text(form.ProgressPendingPaymentComment),
    // Keeps this pass off the lines the user typed (UI_PAGE_STATE.md §5B.3 — watch the
    // input, never the output).
    withItems: false,
    resolvePrice,
    calculateLineTax: makeLineTaxResolver({ priceListCode, resolvePrice })
  }))

  // Why Layer 2 refused, in its own words, so the sticky bar vetoes submit with it instead
  // of inventing a second rule.
  setCtl(pageState, CTL.BUILD_ERROR, applied.valid === false ? text(applied.message) : '')
  if (applied.valid !== false) raisedMarks = consumptionCodes.length
}

// ─── The page contract's two calls ───────────────────────────────────────────

/** Every consequence the Add page has, re-derived from the one column the UI writes. */
export function invoiceDraftDerivations () {
  const sync = (value, api) => syncInvoiceDraft(api)

  return [
    // `immediate` so a deep link that arrives with an outlet already chosen still resolves
    // its price list and due date.
    { key: 'invoiceAdd:outlet', on: { resource: INVOICES, record: 'OutletCode' }, immediate: true, handler: applyInvoiceOutlet },
    { key: 'invoiceAdd:ticks', on: { resource: INVOICES, record: 'OutletConsumptionCode' }, handler: (value, api) => { seedInvoiceLines(api); syncInvoiceDraft(api) } },
    { key: 'invoiceAdd:lines', on: { resource: INVOICES, children: INVOICE_ITEMS }, handler: sync },
    { key: 'invoiceAdd:priceList', on: { resource: INVOICES, record: 'PriceListCode' }, handler: sync },
    { key: 'invoiceAdd:discountType', on: { resource: INVOICES, control: CTL.DISCOUNT_TYPE }, handler: sync },
    { key: 'invoiceAdd:discountValue', on: { resource: INVOICES, control: CTL.DISCOUNT_VALUE }, handler: sync },
    { key: 'invoiceAdd:applyReturns', on: { resource: INVOICES, control: CTL.APPLY_RETURNS }, handler: (value, api) => { applyReturnsToggle(value, api); syncInvoiceDraft(api) } },
    { key: 'invoiceAdd:returns', on: { resource: INVOICES, record: 'OutletReturnCodes' }, handler: sync },
    { key: 'invoiceAdd:dueDate', on: { resource: INVOICES, record: 'DueDate' }, immediate: false, handler: sync },
    { key: 'invoiceAdd:comment', on: { resource: INVOICES, record: 'ProgressPendingPaymentComment' }, immediate: false, handler: sync }
  ]
}

// The opening Add draft. Header only: the lines follow the ticks, and the page contract
// owns the derive rules so replacing this node cannot detach them.
export function buildInvoiceInitNodes ({ outletCode = '', consumptionCode = '', actorName: actor = '' } = {}) {
  const { user } = useAuth()
  raisedMarks = 0

  return [invoiceNode({
    OutletCode: text(outletCode),
    OutletConsumptionCode: text(consumptionCode),
    Date: todayISO(),
    Username: text(actor) || text(user.value?.name || user.value?.email)
  }, [], {}, { withDerive: false })]
}

/** Why the wizard cannot be submitted, or '' when it can. It builds nothing. */
export function invoiceDraftBlock (pageState) {
  if (!text(record(pageState).OutletCode)) return 'Select an outlet to continue.'
  if (!billedLines(pageState).length) {
    return 'Add at least one item with a quantity before continuing.'
  }
  return text(getCtl(pageState, CTL.BUILD_ERROR, ''))
}

export const invoiceDraftLines = billedLines

// Composable shape for setup-context callers. Same functions, one import (§5).
export function useInvoiceDraft () {
  return {
    INVOICE_CONTROL,
    buildInvoiceInitNodes,
    invoiceDraftDerivations,
    invoiceDraftBlock,
    invoiceDraftLines,
    syncInvoiceDraft,
    seedInvoiceLines,
    applyInvoiceOutlet,
    invoiceableConsumptionsOf,
    creditableReturnsOf,
    creditedReturnRows
  }
}
