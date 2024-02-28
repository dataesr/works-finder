import { Col, Row } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useSearchParams } from 'react-router-dom';

import ButtonDropdown from '../../components/button-dropdown';

export default function ActionsPublications({
  allPublications,
  options,
  setAllPublications,
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <Row className="fr-mb-1w">
      <Col className="text-right">
        <ButtonDropdown data={allPublications} label="publications" searchParams={searchParams} />
      </Col>
    </Row>
  );
}

ActionsPublications.propTypes = {
  allPublications: PropTypes.arrayOf(PropTypes.shape({
    affiliations: PropTypes.arrayOf(PropTypes.object).isRequired,
    allIds: PropTypes.arrayOf(PropTypes.object).isRequired,
    datasource: PropTypes.arrayOf(PropTypes.string).isRequired,
    id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  })).isRequired,
  options: PropTypes.object.isRequired,
  setAllPublications: PropTypes.func.isRequired,
};
