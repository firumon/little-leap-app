import { useCurrencyResource } from 'src/_resource/Master/Currencies/composables/useCurrencyResource'
import { progressMetaOf } from 'src/_resource/Operation/OutletConsumptionInvoices/composables/useInvoiceWorkflow'

// The row shapes every invoice list on this page uses, so one invoice never reads two ways.
// `content` and `meta` are positional: one value per `layout` / `metaLayout` slot.

const text = (value) => (value == null ? '' : String(value).trim())

const HOUR = 3600000
const DAY = 86400000

// Audit columns store epoch milliseconds, so all-digits is a timestamp, not a date string.
function timeOf (value) {
  if (value instanceof Date) return value.getTime()
  if (typeof value === 'number') return value
  const raw = text(value)
  if (!raw) return NaN
  if (/^\d+$/.test(raw)) return Number(raw)
  return new Date(raw.length <= 10 ? `${raw}T00:00:00` : raw).getTime()
}

/** How long ago, in words. */
export function elapsedLabel (value) {
  const at = timeOf(value)
  if (Number.isNaN(at)) return ''
  const gap = Math.max(0, Date.now() - at)
  if (gap < HOUR) return 'Just Now'
  if (gap < DAY) return `${Math.floor(gap / HOUR)} hours ago`
  const days = Math.floor(gap / DAY)
  if (days <= 99) return `${days} days ago`
  return `${Math.floor(days / 30)} months ago`
}

// How late, or how soon. `dueInDays` is negative once the date has passed and `null` when
// none was set — an undated invoice is a real state and says so rather than reading as due.
export function dueText (row, short = false) {
  const days = row?.dueInDays
  if (days === null || days === undefined) return 'no due date'
  if (days < 0) return `due by ${Math.abs(days)} days`
  if (days === 0) return 'due today'
  return short ? `in ${days} days` : `due in ${days} days`
}

/** The row's second caption: when it was raised, and where that leaves it. */
export function dateAndDue (row) {
  return [text(row?.date), dueText(row)].filter(Boolean).join(' · ')
}

/** Who raised the document, and when. The top caption of every collections row. */
export function dateAndUser (row) {
  return [text(row?.date), text(row?.username)].filter(Boolean).join(' · ')
}

// The collections row. Due In and Overdue read the same, so only the chip differs.
export function invoiceDueRowPreset (rows = [], { short = false, chipColor = 'primary' } = {}) {
  const { _C } = useCurrencyResource()

  return {
    items: Array.isArray(rows) ? rows : [],
    itemKey: 'code',

    layout: ['caption', 'label', 'caption', 'caption'],
    content: [
      (row) => text(row.code),
      (row) => text(row.outletName) || text(row.outletCode),
      (row) => dateAndUser(row),
      (row) => `Payable: ${_C(row.balance, true)}`
    ],

    metaLayout: ['chip'],
    chip: (row) => dueText(row, short),
    chipColor,
    chipOutline: true,

    clickable: true
  }
}

/** What moved lately: the document on the left, its state and its age on the right. */
export function invoiceRecentRowPreset (rows = []) {
  return {
    items: Array.isArray(rows) ? rows : [],
    itemKey: 'code',

    layout: ['caption', 'label', 'caption'],
    content: [
      (row) => text(row.code),
      (row) => text(row.outletName) || text(row.outletCode),
      (row) => dateAndUser(row)
    ],

    metaLayout: ['label', 'caption'],
    metaLabel: (row) => progressMetaOf(row.invoice).label,
    metaCaption: (row) => elapsedLabel(row.updatedAt),
    metaColor: (row) => progressMetaOf(row.invoice).color,

    clickable: true
  }
}

// The shared prop bag for a list of invoice rows. The click handler is the caller's: it
// belongs to the component that owns the navigation relay.
export function invoiceRowPreset (rows = []) {
  const { _C } = useCurrencyResource()

  return {
    items: Array.isArray(rows) ? rows : [],
    itemKey: 'code',

    layout: ['caption', 'label', 'caption'],
    content: [
      (row) => text(row.code),
      (row) => text(row.outletName) || text(row.outletCode),
      (row) => dateAndDue(row)
    ],

    // The amount as a CHIP: it is the one value a reader scans down the column for, and a
    // chip gives it an edge to find.
    metaLayout: ['chip'],
    chip: (row) => _C(row.balance, true),
    chipColor: (row) => (row.isOverdue ? 'negative' : 'primary'),
    chipOutline: true,

    clickable: true
  }
}

// The same row for a SETTLED invoice. The chip shows what it was WORTH, not its zero
// balance, and no state word: the active pill already says Completed or Cancelled.
export function settledRowPreset (rows = []) {
  const { _C } = useCurrencyResource()

  return {
    ...invoiceRowPreset(rows),
    content: [
      (row) => text(row.code),
      (row) => text(row.outletName) || text(row.outletCode),
      (row) => dateAndUser(row)
    ],
    chip: (row) => _C(row.total, true),
    chipColor: (row) => (row.progress === 'CANCELLED' ? 'grey-6' : 'positive')
  }
}
