import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import PropTypes from 'prop-types';

import {
  affiliationsTemplate,
  allIdsTemplate,
  authorsTemplate,
  datasourceTemplate,
  statusTemplate,
} from '../utils/templates';

export default function WorksView({
  selectedWorks,
  setSelectedWorks,
  works,
}) {
  return (
    <DataTable
      currentPageReportTemplate="{first} to {last} of {totalRecords}"
      dataKey="id"
      filterDisplay="row"
      metaKeySelection={false}
      onSelectionChange={(e) => setSelectedWorks(e.value)}
      paginator
      paginatorPosition="both"
      paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      rows={50}
      rowsPerPageOptions={[25, 50, 100, 200, 500, 1000, 5000]}
      scrollable
      selection={selectedWorks}
      selectionPageOnly
      size="small"
      stripedRows
      style={{ fontSize: '11px', lineHeight: '10px' }}
      value={works}
    >
      <Column selectionMode="multiple" />
      <Column field="status" header="Status" body={statusTemplate} />
      <Column field="allIds" header="Ids" body={allIdsTemplate} filter filterMatchMode="contains" filterPlaceholder="Search by id" />
      <Column field="datasource" header="Source" body={datasourceTemplate} />
      <Column field="type" header="Type" />
      <Column field="year" header="Year" />
      <Column field="journal_name" header="Journal" />
      <Column field="affiliationsHtml" header="Affiliations" body={affiliationsTemplate} />
      <Column field="authors" header="Authors" body={authorsTemplate} filter filterMatchMode="contains" showFilterMenu={false} filterPlaceholder="Search by author" style={{ minWidth: '200px' }} />
      <Column field="title" header="Title" filter filterMatchMode="contains" showFilterMenu={false} filterPlaceholder="Search by title" style={{ minWidth: '10px' }} />
    </DataTable>
  );
}

WorksView.propTypes = {
  selectedWorks: PropTypes.arrayOf(PropTypes.shape({
    affiliations: PropTypes.arrayOf(PropTypes.string).isRequired,
    allIds: PropTypes.arrayOf(PropTypes.object).isRequired,
    authors: PropTypes.arrayOf(PropTypes.string).isRequired,
    datasource: PropTypes.arrayOf(PropTypes.string).isRequired,
    id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  })).isRequired,
  setSelectedWorks: PropTypes.func.isRequired,
  works: PropTypes.arrayOf(PropTypes.shape({
    affiliations: PropTypes.arrayOf(PropTypes.string).isRequired,
    allIds: PropTypes.arrayOf(PropTypes.object).isRequired,
    authors: PropTypes.arrayOf(PropTypes.string).isRequired,
    datasource: PropTypes.arrayOf(PropTypes.string).isRequired,
    id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  })).isRequired,
};
