const RESOURCE = 'OutletPayments'

// `/operation/outlet-payments/{code}/_action/cancel`. CancelConfirm is the hydration point.
export default {
  sections: ['PageHeader'],
  contents: ['CancelConfirm'],

  PropsPageHeader: {
    title: 'Cancel Payment Receipt',
    reload: false
  },

  // Page.vue keeps ONE pageState per Page mount and never clears it, so the nodes of the
  // page visited before this one are still here (UI_PAGE_STATE_NODES §5.7A).
  ready ({ pageState }) {
    pageState.resetForResource(RESOURCE)
  }
}
