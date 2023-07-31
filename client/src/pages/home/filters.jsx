import {
  Alert,
  Button,
  Checkbox,
  CheckboxGroup,
  Col,
  Row,
  Select,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import TagInput from '../../components/tag-input';

const identifiers = ['crossref', 'hal_id', 'datacite'];
const sources = [{ key: 'bso', label: 'French Monitor (BSO)' }, { key: 'openalex', label: 'OpenAlex ⚠️ API does not allow text search on authors name' }];
const years = ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'].map((year) => ({ label: year, value: year }));

export default function Filters({ sendQuery }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentSeachParams, setCurrentSeachParams] = useState({});
  const [message, setMessage] = useState('');
  const [onInputAffiliationsHandler, setOnInputAffiliationsHandler] = useState(false);
  const [onInputAuthorsHandler, setOnInputAuthorsHandler] = useState(false);

  useEffect(() => {
    if (searchParams.size === 0) {
      setSearchParams({
        affiliations: [],
        affiliationsToExclude: [],
        affiliationsToInclude: [],
        authors: [],
        authorsToExclude: [],
        dataIdentifiers: identifiers,
        datasources: sources.map((source) => source.key),
        endYear: '2021',
        moreOptions: false,
        startYear: '2021',
      });
    } else {
      setCurrentSeachParams({
        affiliations: searchParams.getAll('affiliations'),
        affiliationsToExclude: searchParams.getAll('affiliationsToExclude'),
        affiliationsToInclude: searchParams.getAll('affiliationsToInclude'),
        authors: searchParams.getAll('authors'),
        authorsToExclude: searchParams.getAll('authorsToExclude'),
        dataIdentifiers: searchParams.getAll('dataIdentifiers'),
        datasources: searchParams.getAll('datasources'),
        endYear: searchParams.get('endYear'),
        moreOptions: searchParams.get('moreOptions')?.toString() === 'true',
        startYear: searchParams.get('startYear'),
      });
    }
  }, [searchParams, setSearchParams]);

  const onDatasourcesChange = (key) => {
    const { datasources } = currentSeachParams;
    if (datasources.includes(key)) {
      setSearchParams({ ...currentSeachParams, datasources: datasources.filter((datasource) => datasource !== key) });
    } else {
      setSearchParams({ ...currentSeachParams, datasources: [...datasources, key] });
    }
  };

  const onIdentifiersChange = (label) => {
    const { dataIdentifiers } = currentSeachParams;
    if (dataIdentifiers.includes(label)) {
      setSearchParams({ ...currentSeachParams, dataIdentifiers: dataIdentifiers.filter((item) => item !== label) });
    } else {
      setSearchParams({ ...currentSeachParams, dataIdentifiers: [...dataIdentifiers, label] });
    }
  };

  const checkAndSendQuery = () => {
    if (onInputAffiliationsHandler || onInputAuthorsHandler) {
      setMessage('Don\'t forget to validate the input.');
      return;
    }
    if (currentSeachParams.affiliations.length === 0 && currentSeachParams.authors.length === 0) {
      setMessage('You must provide at least one affiliation or one author.');
      return;
    }
    setMessage('');
    sendQuery(currentSeachParams);
  };

  return (
    <>
      <Row gutters>
        <Col n="5">
          <TagInput
            hint="At least one of these affiliations should be present, OR operator"
            label="Affiliations (Name, Grid, RNSR, RoR, HAL structId or viaf)"
            onTagsChange={(affiliations) => setSearchParams({ ...currentSeachParams, affiliations })}
            tags={currentSeachParams.affiliations}
            onInputHandler={setOnInputAffiliationsHandler}
          />
        </Col>
        <Col n="5">
          <TagInput
            hint="At least one of these authors should be present, OR operator. ⚠️ French monitor only"
            label="Authors"
            onTagsChange={(authors) => setSearchParams({ ...currentSeachParams, authors })}
            tags={currentSeachParams.authors}
            onInputHandler={setOnInputAuthorsHandler}
          />
        </Col>
        <Col n="2" className="fr-pt-4w">
          Datasources:
          <CheckboxGroup>
            {
              sources.map((source) => (
                <Checkbox
                  checked={currentSeachParams.datasources?.includes(source.key)}
                  key={source.key}
                  label={source.label}
                  onChange={() => onDatasourcesChange(source.key)}
                  size="sm"
                />
              ))
            }
          </CheckboxGroup>
        </Col>
      </Row>
      {
        currentSeachParams.moreOptions && (
          <>
            <Row gutters>
              <Col n="5">
                <TagInput
                  hint="All these affiliations must be present, AND operator"
                  label="Affiliations to include mandatory"
                  onTagsChange={(affiliationsToInclude) => setSearchParams({ ...currentSeachParams, affiliationsToInclude })}
                  tags={currentSeachParams.affiliationsToInclude}
                />
              </Col>
              <Col n="5">
                <TagInput
                  hint="None of these authors must be present, AND operator"
                  label="Authors to exclude"
                  onTagsChange={(authorsToExclude) => setSearchParams({ ...currentSeachParams, authorsToExclude })}
                  tags={currentSeachParams.authorsToExclude}
                />
              </Col>
            </Row>
            <Row gutters>
              <Col n="5">
                <TagInput
                  hint="None of these affiliations must be present, AND operator"
                  label="Affiliations to exclude"
                  onTagsChange={(affiliationsToExclude) => setSearchParams({ ...currentSeachParams, affiliationsToExclude })}
                  tags={currentSeachParams.affiliationsToExclude}
                />
              </Col>
            </Row>
          </>
        )
      }
      <Row gutters alignItems="bottom">
        <Col n="5">
          <Row gutters>
            <Col>
              <Select label="Start year" options={years} selected={currentSeachParams.startYear} onChange={(e) => setSearchParams({ ...currentSeachParams, startYear: e.target.value })} />
            </Col>
            <Col>
              <Select label="End year" options={years} selected={currentSeachParams.endYear} onChange={(e) => setSearchParams({ ...currentSeachParams, endYear: e.target.value })} />
            </Col>
          </Row>
        </Col>
        {
          currentSeachParams.moreOptions && (
            <Col n="3">
              {
                currentSeachParams.datasources.includes('bso') && (
                  <>
                    BSO Identifiers:
                    <CheckboxGroup isInline>
                      {
                        identifiers.map((identifier) => (
                          <Checkbox
                            checked={currentSeachParams.dataIdentifiers.includes(identifier)}
                            key={identifier}
                            label={identifier}
                            onChange={() => onIdentifiersChange(identifier)}
                            size="sm"
                          />
                        ))
                      }
                    </CheckboxGroup>
                  </>
                )
              }
            </Col>
          )
        }
        <Col className="text-right">
          <Button
            onClick={() => setSearchParams({ ...currentSeachParams, moreOptions: !currentSeachParams.moreOptions })}
            secondary
            size="sm"
            icon="ri-filter-line"
          >
            {currentSeachParams.moreOptions ? 'Less filters' : 'More filters'}
          </Button>
          <Button
            icon="ri-search-line"
            onClick={checkAndSendQuery}
            size="sm"
          >
            Search productions
          </Button>
        </Col>
      </Row>
      {
        message && (
          <Row className="fr-mt-1w">
            <Col>
              <Alert type="error" description={message} />
            </Col>
          </Row>
        )
      }
    </>
  );
}

Filters.propTypes = {
  sendQuery: PropTypes.func.isRequired,
};
