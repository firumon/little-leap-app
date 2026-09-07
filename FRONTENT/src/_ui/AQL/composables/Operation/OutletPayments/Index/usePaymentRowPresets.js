import { useCurrencyResource } from 'src/_resource/Master/Currencies/composables/useCurrencyResource'

const text = (value) => (value == null ? '' : String(value).trim())

export function dueText (row) {
  const days = row?.dueInDays
  if (days === null || days === undefined) return 'no due date'
  if (days < 0) return `due by ${Math.abs(days)} days`
  if (days === 0) return 'due today'
  return `due in ${days} days`
}

function overdueText (row) {
  const days = row?.dueInDays
  if (days === null || days === undefined) return 'No due date'
  if (days >= 0) return 'Due today'
  return `Due ${Math.abs(days)} days ago`
}

// Payment receipt rows — Recent, Completed and Cancelled all read the same way.
export function paymentRowPreset (rows = []) {
  const { _C } = useCurrencyResource()

  return {
    items: Array.isArray(rows) ? rows : [],
    itemKey: 'code',

    layout: ['caption', 'label', 'caption'],
    content: [
      (row) => text(row.code),
      (row) => text(row.outletName) || text(row.outletCode),
      (row) => [text(row.date), text(row.username), text(row.mode)].filter(Boolean).join(' • ')
    ],

    metaLayout: ['chip'],
    chip: (row) => _C(row.amount, true),
    chipColor: (row) => (row.isCancelled ? 'grey-7' : 'teal-7'),
    chipOutline: true,

    clickable: true
  }
}

// Open invoices that are past their due date.
export function overdueInvoicePreset (rows = []) {
  const { _C } = useCurrencyResource()

  return {
    items: Array.isArray(rows) ? rows : [],
    itemKey: 'code',

    layout: ['caption', 'label', 'caption'],
    content: [
      (row) => overdueText(row),
      (row) => text(row.outletName) || text(row.outletCode),
      (row) => [text(row.date), text(row.username)].filter(Boolean).join(' • ')
    ],

    metaLayout: ['chip'],
    chip: (row) => _C(row.balance, true),
    chipColor: 'negative',
    chipOutline: true,

    clickable: true
  }
}

// One row per outlet that still owes money.
export function outletDebtPreset (rows = []) {
  const { _C } = useCurrencyResource()

  return {
    items: Array.isArray(rows) ? rows : [],
    itemKey: 'code',

    layout: ['caption', 'label', 'caption'],
    content: [
      (row) => text(row.code),
      (row) => text(row.name) || text(row.code),
      (row) => `${row.invoiceCount} open invoice${row.invoiceCount === 1 ? '' : 's'}`
    ],

    metaLayout: ['chip'],
    chip: (row) => _C(row.totalBalance, true),
    chipColor: 'negative',
    chipOutline: true,

    clickable: true
  }
}
