/**
 * Every list view is a `.vue` override under `Index/List<ViewName>.vue`.
 * They all read the Layer 2 aggregate, because two of the five show invoices and
 * outlets rather than this resource's own rows.
 */
export default {
  sections: [
    'PageHeader',
    'MetricCards',
    // The day's collections, directly under the standing position they are measured against.
    // Hides itself when there was nothing overdue to collect this morning.
    'LinearProgress',
    'FilterInput',
    'ListSwitcher'
  ],
  contents: ['List'],

  PropsPageHeader: {
    title: 'Outlet Payments',
    subtitle: 'Track collections and settle consumption invoices',
    reload: true
  }
}
