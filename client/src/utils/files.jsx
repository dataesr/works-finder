import Papa from 'papaparse';

import { status } from '../config';

const hashCode = (str) => {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0; i < str.length; i += 1) {
    const chr = str.charCodeAt(i);
    // eslint-disable-next-line no-bitwise
    hash = ((hash << 5) - hash) + chr;
    // eslint-disable-next-line no-bitwise
    hash |= 0; // Convert to 32bit integer
  }
  // return positive numbers only
  return hash + 2147483647 + 1;
};

const getFileName = ({ extension, label, searchParams }) => {
  let fileName = 'works_magnet';
  fileName += label ? `_${label.replace(' ', '')}` : '';
  fileName += `_${Date.now()}`;
  fileName += `_${searchParams.get('startYear')}`;
  fileName += `_${searchParams.get('endYear')}`;
  fileName += `_${hashCode(searchParams.get('affiliations'))}`;
  fileName += `.${extension}`;
  return fileName;
};

const export2FosmCsv = ({ data, label, searchParams }) => {
  let idsToExport = ['doi', 'hal_id', 'nnt_id', 'openalex'];
  let csvHeader = idsToExport.join(';');
  if (label === 'datasets') {
    idsToExport = ['datacite', 'crossref'];
    csvHeader = 'dataset';
  }
  const rows = data
    .filter((publication) => publication.status === status.validated.id)
    .map((publication) => {
      const row = [];
      idsToExport.forEach((currentId) => {
        const elt = publication.allIds.filter((id) => id.id_type === currentId);
        if (elt.length) {
          row.push(elt[0].id_value);
        } else {
          row.push('');
        }
      });
      return row.join(label === 'datasets' ? '' : ';');
    });
  const csvFile = Papa.unparse(rows, { columns: csvHeader, skipEmptyLines: 'greedy' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([csvFile], { type: 'text/csv;charset=utf-8' }));
  link.setAttribute('download', getFileName({ extension: 'csv', label: label.concat('BSO'), searchParams }));
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const export2Csv = ({ data, label, searchParams }) => {
  data.forEach((work) => {
    work.allIds?.forEach((id) => {
      work[id.id_type] = id.id_value;
    });
    delete work.affiliations;
    delete work.affiliationsHtml;
    delete work.affiliationsTooltip;
    delete work.allIds;
    delete work.authors;
    delete work.datasource;
    delete work.id;
    if ((work?.fr_authors_orcid ?? []).length > 0) {
      work.fr_authors_orcid = JSON.stringify(work?.fr_authors_orcid ?? []);
    }
    if ((work?.fr_publications_linked ?? []).length > 0) {
      work.fr_publications_linked = JSON.stringify(work?.fr_publications_linked ?? []);
    }
  });
  const csvFile = Papa.unparse(data, { skipEmptyLines: 'greedy' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([csvFile], { type: 'text/csv;charset=utf-8' }));
  const fileName = getFileName({ extension: 'csv', label, searchParams });
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const export2json = ({ data, label, searchParams }) => {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  const fileName = getFileName({ extension: 'json', label, searchParams });
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const export2jsonl = ({ data, label, searchParams }) => {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([data.map(JSON.stringify).join('\n')], { type: 'application/jsonl+json' }));
  const fileName = getFileName({ extension: 'jsonl', label, searchParams });
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const importJson = (e, tagAffiliations) => {
  const fileReader = new FileReader();
  fileReader.readAsText(e.target.files[0], 'UTF-8');
  fileReader.onload = (f) => {
    const allAffiliations = JSON.parse(f.target.result);
    const decidedAffiliations = allAffiliations?.filter((affiliation) => affiliation.status !== status.tobedecided.id) || [];
    if (decidedAffiliations) {
      const validatedAffiliations = decidedAffiliations.filter((decidedAffiliation) => decidedAffiliation.status === status.validated.id);
      tagAffiliations(validatedAffiliations, status.validated.id);
      const excludedAffiliations = decidedAffiliations.filter((decidedAffiliation) => decidedAffiliation.status === status.excluded.id);
      tagAffiliations(excludedAffiliations, status.excluded.id);
    }
  };
};

export {
  export2Csv,
  export2FosmCsv,
  export2json,
  export2jsonl,
  importJson,
};
