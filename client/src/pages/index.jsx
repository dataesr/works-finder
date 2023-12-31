/* eslint-disable max-len */
/* eslint-disable indent */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-case-declarations */
import {
  Col,
  Container,
  Row,
  Tab,
  Tabs,
} from '@dataesr/react-dsfr';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';

import Actions from './actions';
import AffiliationsTab from './affiliationsTab';
import { PageSpinner } from '../components/spinner';
import DatasetsTab from './datasetsTab';
import Filters from './filters';
import PublicationsTab from './publicationsTab';
import { getAffiliationsHtmlField, getAffiliationsTooltipField } from '../utils/templates';
import { getData } from '../utils/works';
import { status } from '../config';

import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';

const { VITE_WS_HOST } = import.meta.env;

export default function Home() {
  const [allAffiliations, setAllAffiliations] = useState([]);
  const [allDatasets, setAllDatasets] = useState([]);
  const [allPublications, setAllPublications] = useState([]);
  const [options, setOptions] = useState({});
  const [regexp, setRegexp] = useState();
  const [selectedAffiliations, setSelectedAffiliations] = useState([]);
  const [selectedDatasets, setSelectedDatasets] = useState([]);
  const [selectedPublications, setSelectedPublications] = useState([]);

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['data'],
    queryFn: () => getData(options),
    enabled: false,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  useWebSocket(VITE_WS_HOST, {
    onMessage: (message) => console.log(message.data),
    share: true,
  });

  const sendQuery = async (_options) => {
    setAllAffiliations([]);
    setAllDatasets([]);
    setAllPublications([]);
    await setOptions(_options);
    refetch();
  };

  useEffect(() => {
    const regexpTmp = new RegExp(`(${(options?.affiliations ?? [])
      .map((affiliationQuery) => affiliationQuery
        .replaceAll(/(a|à|á|â|ã|ä|å)/g, '(a|à|á|â|ã|ä|å)')
        .replaceAll(/(e|è|é|ê|ë)/g, '(e|è|é|ê|ë)')
        .replaceAll(/(i|ì|í|î|ï)/g, '(i|ì|í|î|ï)')
        .replaceAll(/(o|ò|ó|ô|õ|ö|ø)/g, '(o|ò|ó|ô|õ|ö|ø)')
        .replaceAll(/(u|ù|ú|û|ü)/g, '(u|ù|ú|û|ü)')
        .replaceAll(/(y|ý|ÿ)/g, '(y|ý|ÿ)')
        .replaceAll(/(n|ñ)/g, '(n|ñ)')
        .replaceAll(/(c|ç)/g, '(c|ç)')
        .replaceAll(/æ/g, '(æ|ae)')
        .replaceAll(/œ/g, '(œ|oe)'))
      .join('|')})`, 'gi');
    setRegexp(regexpTmp);
  }, [options?.affiliations]);

  useEffect(() => {
    if (data) {
      // TODO do it on the API
      const allDatasetsTmp = data.datasets.results
        .map((dataset) => ({
          ...dataset,
          affiliationsHtml: getAffiliationsHtmlField(dataset, regexp),
          affiliationsTooltip: getAffiliationsTooltipField(dataset),
          status: status.tobedecided.id,
        }));
      const allPublicationsTmp = data.publications.results
        .map((publication) => ({
          ...publication,
          affiliationsHtml: getAffiliationsHtmlField(publication, regexp),
          affiliationsTooltip: getAffiliationsTooltipField(publication),
          status: status.tobedecided.id,
        }));
      setAllAffiliations(data.affiliations);
      setAllDatasets(allDatasetsTmp);
      setAllPublications(allPublicationsTmp);
    }
  }, [data, regexp]);

  const tagPublications = (publications, action) => {
    const allPublicationsTmp = [...allPublications];
    const publicationsIds = publications.map((publication) => publication.id);
    // eslint-disable-next-line no-return-assign, no-param-reassign
    allPublicationsTmp.filter((publication) => publicationsIds.includes(publication.id)).map((publication) => publication.status = action);
    setAllPublications(allPublicationsTmp);
    setSelectedPublications([]);
  };

  const tagDatasets = (datasets, action) => {
    const allDatasetsTmp = [...allDatasets];
    const datasetsIds = datasets.map((dataset) => dataset.id);
    // eslint-disable-next-line no-return-assign, no-param-reassign
    allDatasetsTmp.filter((dataset) => datasetsIds.includes(dataset.id)).map((dataset) => dataset.status = action);
    setAllDatasets(allDatasetsTmp);
    setSelectedDatasets([]);
  };

  const tagAffiliations = (affiliations, action) => {
    if (action !== status.excluded.id) {
      const worksIds = affiliations.map((affiliation) => affiliation.works).flat();
      const allPublicationsTmp = [...allPublications];
      // eslint-disable-next-line no-return-assign, no-param-reassign
      allPublicationsTmp.filter((publication) => worksIds.includes(publication.id)).map((publication) => publication.status = action);
      setAllPublications(allPublicationsTmp);
      const allDatasetsTmp = [...allDatasets];
      // eslint-disable-next-line no-return-assign, no-param-reassign
      allDatasetsTmp.filter((dataset) => worksIds.includes(dataset.id)).map((dataset) => dataset.status = action);
      setAllDatasets(allDatasetsTmp);
    }
    const allAffiliationsTmp = [...allAffiliations];
    const affiliationIds = affiliations.map((affiliation) => affiliation.id);
    // eslint-disable-next-line no-return-assign, no-param-reassign
    allAffiliationsTmp.filter((affiliation) => affiliationIds.includes(affiliation.id)).map((affiliation) => affiliation.status = action);
    setAllAffiliations(allAffiliationsTmp);
    setSelectedAffiliations([]);
  };

  return (
    <>
      <Container className="fr-my-5w" as="section" fluid>
        <Row className="fr-px-5w">
          <Col>
            <Filters
              sendQuery={sendQuery}
            />
          </Col>
        </Row>
      </Container>
      <Container className="fr-mx-5w" as="section" fluid>
        {/* TODO add Datasets ? */}
        <Actions
          allAffiliations={allAffiliations}
          allPublications={allPublications}
          options={options}
          setAllAffiliations={setAllAffiliations}
          setAllPublications={setAllPublications}
          tagAffiliations={tagAffiliations}
        />
        {isFetching && (
          <PageSpinner />
        )}
        {!isFetching && (allAffiliations.length > 0 || allDatasets.length > 0 || allPublications.length > 0) && (
          <Tabs defaultActiveTab={0}>
            <Tab label="Grouped affiliations of works">
              <AffiliationsTab
                affiliations={allAffiliations}
                selectedAffiliations={selectedAffiliations}
                setSelectedAffiliations={setSelectedAffiliations}
                tagAffiliations={tagAffiliations}
              />
            </Tab>
            <Tab label="List all publications">
              <PublicationsTab
                publications={allPublications}
                selectedPublications={selectedPublications}
                setSelectedPublications={setSelectedPublications}
                tagPublications={tagPublications}
                types={data.publications.types}
                years={data.publications.years}
              />
            </Tab>
            <Tab label="List all datasets">
              <DatasetsTab
                datasets={allDatasets}
                selectedDatasets={selectedDatasets}
                setSelectedDatasets={setSelectedDatasets}
                tagDatasets={tagDatasets}
                types={data.datasets.types}
                years={data.datasets.years}
              />
            </Tab>
          </Tabs>
        )}
      </Container>
    </>
  );
}
