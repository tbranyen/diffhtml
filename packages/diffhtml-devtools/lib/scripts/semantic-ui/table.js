export default `
  /* Table Content */
  :host th,
  :host td {
    -webkit-transition: background 0.1s ease, color 0.1s ease;
    transition: background 0.1s ease, color 0.1s ease;
  }

  /* Headers */
  :host thead {
    box-shadow: none;
  }
  :host thead th {
    cursor: auto;
    background: #F9FAFB;
    text-align: inherit;
    color: rgba(0, 0, 0, 0.87);
    padding: 0.92857143em 0.78571429em;
    vertical-align: inherit;
    font-style: none;
    font-weight: bold;
    text-transform: none;
    border-bottom: 1px solid rgba(34, 36, 38, 0.1);
    border-left: none;
  }
  :host thead tr > th:first-child {
    border-left: none;
  }
  :host thead tr:first-child > th:first-child {
    border-radius: 0.28571429rem 0em 0em 0em;
  }
  :host thead tr:first-child > th:last-child {
    border-radius: 0em 0.28571429rem 0em 0em;
  }
  :host thead tr:first-child > th:only-child {
    border-radius: 0.28571429rem 0.28571429rem 0em 0em;
  }

  /* Footer */
  :host tfoot {
    box-shadow: none;
  }
  :host tfoot th {
    cursor: auto;
    border-top: 1px solid rgba(34, 36, 38, 0.15);
    background: #F9FAFB;
    text-align: inherit;
    color: rgba(0, 0, 0, 0.87);
    padding: 0.78571429em 0.78571429em;
    vertical-align: middle;
    font-style: normal;
    font-weight: normal;
    text-transform: none;
  }
  :host tfoot tr > th:first-child {
    border-left: none;
  }
  :host tfoot tr:first-child > th:first-child {
    border-radius: 0em 0em 0em 0.28571429rem;
  }
  :host tfoot tr:first-child > th:last-child {
    border-radius: 0em 0em 0.28571429rem 0em;
  }
  :host tfoot tr:first-child > th:only-child {
    border-radius: 0em 0em 0.28571429rem 0.28571429rem;
  }

  /* Table Row */
  :host td {
    border-top: 1px solid rgba(34, 36, 38, 0.1);
  }
  :host:first-child td {
    border-top: none;
  }

  /* Table Cells */
  :host td {
    padding: 0.78571429em 0.78571429em;
    text-align: inherit;
  }

  /* Icons */
  :host > .icon {
    vertical-align: baseline;
  }
  :host > .icon:only-child {
    margin: 0em;
  }

  /* Table Segment */
  :host.segment {
    padding: 0em;
  }
  :host.segment:after {
    display: none;
  }
  :host.segment.stacked:after {
    display: block;
  }

  /* Responsive */
  @media only screen and (max-width: 767px) {
    :host:not(.unstackable) {
      width: 100%;
    }
    :host:not(.unstackable) tbody,
    :host:not(.unstackable) tr,
    :host:not(.unstackable) tr > th,
    :host:not(.unstackable) tr > td {
      width: auto !important;
      display: block !important;
    }
    :host:not(.unstackable) {
      padding: 0em;
    }
    :host:not(.unstackable) thead {
      display: block;
    }
    :host:not(.unstackable) tfoot {
      display: block;
    }
    :host:not(.unstackable) tr {
      padding-top: 1em;
      padding-bottom: 1em;
      box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.1) inset !important;
    }
    :host:not(.unstackable) > th,
    :host:not(.unstackable) > td {
      background: none;
      border: none !important;
      padding: 0.25em 0.75em !important;
      box-shadow: none !important;
    }
    :host:not(.unstackable) th:first-child,
    :host:not(.unstackable) td:first-child {
      font-weight: bold;
    }

  /* Definition Table */
    .ui.definition.table:not(.unstackable) thead th:first-child {
      box-shadow: none !important;
    }
  }


  /*******************************
              Coupling
  *******************************/


  /* UI Image */
  :host th .image,
  :host th .image img,
  :host td .image,
  :host td .image img {
    max-width: none;
  }


  /*--------------
      Complex
  ---------------*/

  :host {
    border-collapse: collapse;
  }
  :host thead th {
    border-left: none;
    border-right: none;
  }
  :host thead th {
    border-left: 1px solid rgba(34, 36, 38, 0.15);
    border-right: 1px solid rgba(34, 36, 38, 0.15);
  }
  :host th {
    border-left: none;
    border-right: none;
  }
  :host th,
  :host td {
    border-left: 1px solid rgba(34, 36, 38, 0.1);
    border-right: 1px solid rgba(34, 36, 38, 0.1);
  }


  :host th,
  :host td {
    border-left: 1px solid rgba(34, 36, 38, 0.1);
  }
  :host th:first-child,
  :host td:first-child {
    border-left: none;
  }


  :host:hover,
  :host td.selectable:hover {
    background: rgba(0, 0, 0, 0.05) !important;
    color: rgba(0, 0, 0, 0.95) !important;
  }

  /* Selectable Cell Link */
  :host td.selectable {
    padding: 0em;
  }
  :host td.selectable > a:not(.ui) {
    display: block;
    color: inherit;
    padding: 0.78571429em 0.78571429em;
  }

  /* Other States */
  :host.error:hover,
  :host tr td.selectable.error:hover,
  :host:hover td.error {
    background: #ffe7e7 !important;
    color: #943634 !important;
  }
  :host.warning:hover,
  :host tr td.selectable.warning:hover,
  :host:hover td.warning {
    background: #fff4e4 !important;
    color: #493107 !important;
  }
  :host.active:hover,
  :host tr td.selectable.active:hover,
  :host:hover td.active {
    background: #E0E0E0 !important;
    color: rgba(0, 0, 0, 0.87) !important;
  }
  :host.positive:hover,
  :host tr td.selectable.positive:hover,
  :host:hover td.positive {
    background: #f7ffe6 !important;
    color: #275b28 !important;
  }
  :host.negative:hover,
  :host tr td.selectable.negative:hover,
  :host:hover td.negative {
    background: #ffe7e7 !important;
    color: #943634 !important;
  }
`;


