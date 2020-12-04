import React from "react";

// reactstrap components
import {
  Alert,
  Container
} from "reactstrap";

class SimpleFooter extends React.Component {
  render() {
    return (
      <Container>
        <Alert color="success" style={{ backgroundColor: "#0eaf35", color: "#000000", fontSize: "1.5em", textAlign: "center" }}>
          {this.props.text}
        </Alert>
      </Container>
    );
  }
}

export default SimpleFooter;
