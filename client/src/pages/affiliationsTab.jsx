import {
  Checkbox,
  CheckboxGroup,
  Col,
  Row,
  TextInput,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import AffiliationsView from './affiliationsView';
import Gauge from '../components/gauge';
import { status } from '../config';
import { normalizeName, renderButtons } from '../utils/works';

export default function AffiliationsTab({ affiliations, selectedAffiliations, setSelectedAffiliations, tagAffiliations }) {
  const [filteredAffiliations, setFilteredAffiliations] = useState([]);
  const [filteredAffiliationName, setFilteredAffiliationName] = useState('');
  const [filteredStatus, setFilteredStatus] = useState([status.tobedecided.id]);
  const [timer, setTimer] = useState();

  useEffect(() => {
    setFilteredAffiliations(affiliations);
  }, [affiliations]);

  useEffect(() => {
    if (timer) {
      clearTimeout(timer);
    }
    const timerTmp = setTimeout(() => {
      const filteredAffiliationsTmp = affiliations.filter((affiliation) => normalizeName(affiliation.name).includes(normalizeName(filteredAffiliationName))
        && filteredStatus.includes(affiliation.status));
      setFilteredAffiliations(filteredAffiliationsTmp);
    }, 500);
    setTimer(timerTmp);
    // The timer should not be tracked
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [affiliations, filteredAffiliationName, filteredStatus]);

  const onStatusChange = (st) => {
    if (filteredStatus.includes(st)) {
      setFilteredStatus(filteredStatus.filter((filteredSt) => filteredSt !== st));
    } else {
      setFilteredStatus(filteredStatus.concat([st]));
    }
  };

  return (
    <>
      <Row>
        <Col n="4">
          {renderButtons(selectedAffiliations, tagAffiliations)}
        </Col>
        <Col n="8">
          <Gauge
            data={Object.values(status).map((st) => ({
              ...st,
              value: affiliations.filter((affiliation) => affiliation.status === st.id).length,
            }))}
          />
        </Col>
      </Row>
      <Row gutters>
        <Col n="2">
          <TextInput
            label="Filter affiliations on name"
            onChange={(e) => setFilteredAffiliationName(e.target.value)}
            value={filteredAffiliationName}
          />
          <CheckboxGroup
            hint="Filter affiliations on selected status"
            legend="Status"
          >
            {Object.values(status).map((st) => (
              <Checkbox
                checked={filteredStatus.includes(st.id)}
                key={st.id}
                label={st.label}
                onChange={() => onStatusChange(st.id)}
                size="sm"
              />
            ))}
          </CheckboxGroup>
        </Col>
        <Col n="10">
          <AffiliationsView
            allAffiliations={filteredAffiliations}
            selectedAffiliations={selectedAffiliations}
            setSelectedAffiliations={setSelectedAffiliations}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          {renderButtons(selectedAffiliations, tagAffiliations)}
        </Col>
      </Row>
    </>
  );
}

AffiliationsTab.propTypes = {
  affiliations: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    nameHtml: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    works: PropTypes.arrayOf(PropTypes.string).isRequired,
    worksNumber: PropTypes.number.isRequired,
  })).isRequired,
  selectedAffiliations: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    nameHtml: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    works: PropTypes.arrayOf(PropTypes.string).isRequired,
    worksNumber: PropTypes.number.isRequired,
  })).isRequired,
  setSelectedAffiliations: PropTypes.func.isRequired,
  tagAffiliations: PropTypes.func.isRequired,
};
