const getQuery = ({ datasource, filters }) => {
  const query = { size: 100, query: { bool: {} } };
  switch (datasource) {
    case 'bso':
      if (filters.affiliations.length > 0 || filters.authors.length > 0 || filters?.startYear || filters?.endYear) {
        query.query.bool.must = [];
      }
      filters.affiliations.forEach((affiliation) => {
        query.query.bool.must.push({ match: { 'affiliations.name': { query: affiliation, operator: 'and' } } });
      });
      filters.authors.forEach((author) => {
        query.query.bool.must.push({ match: { 'authors.full_name': { query: author, operator: 'and' } } });
      });
      if (filters?.startYear && filters?.endYear) {
        query.query.bool.must.push({ range: { year: { gte: filters.startYear, lte: filters.endYear } } });
      } else if (filters?.startYear) {
        query.query.bool.must.push({ range: { year: { gte: filters.startYear } } });
      } else if (filters?.endYear) {
        query.query.bool.must.push({ range: { year: { lte: filters.endYear } } });
      }
      if (filters.affiliationsToExclude.length > 0 || filters.authorsToExclude.length > 0) {
        query.query.bool.must_not = [];
      }
      filters.affiliationsToExclude.forEach((affiliationToExclude) => {
        query.query.bool.must_not.push({ match: { 'affiliations.name': { query: affiliationToExclude, operator: 'and' } } });
      });
      filters.authorsToExclude.forEach((authorToExclude) => {
        query.query.bool.must_not.push({ match: { 'authors.full_name': { query: authorToExclude, operator: 'and' } } });
      });
      break;
    default:
  }
  return query;
};

export default getQuery;
