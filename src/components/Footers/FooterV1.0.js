import React from "react";

// reactstrap components
import {
  Alert,
  Container
} from "reactstrap";

import {
  TEXT_FOOTER
} from '../../helpers/constants';

class SimpleFooter extends React.Component {
  render() {
    return (
      <Container>
        <Alert color="success" style={{ backgroundColor: "#0eaf35", color: "#000000", fontSize: "1.5em", textAlign: "center" }}>
          {TEXT_FOOTER}
        </Alert>
      </Container>
    );
  }
}

export default SimpleFooter;
