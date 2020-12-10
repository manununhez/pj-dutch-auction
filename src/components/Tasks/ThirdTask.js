import React from "react";

// reactstrap components
import {
    Container,
    Row,
    Col,
    Alert,
    Card,
    FormGroup,
    Label,
    Input
} from "reactstrap";

import { BRANDS } from '../../helpers/constants';

class ThirdTask extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedOption: []
        }

        this.validateInput = this._validateInput.bind(this);
    }

    _validateInput(brand) {
        let { selectedOption } = this.state
        let index = selectedOption.indexOf(brand)

        if (index === -1) {
            selectedOption.push(brand)
        } else {
            selectedOption = selectedOption.filter((item) => item !== brand);
        }

        this.setState({ selectedOption: selectedOption })

        this.props.action(selectedOption)
    }

    render() {
        return (
            <Container className="justify-content-md-center">
                {this.props.text}
                <Alert style={{ fontSize: "1.0rem" }} color="warning" isOpen={this.props.error.showError}>
                    <span className="alert-inner--text ml-1">
                        {this.props.error.textError}
                    </span>
                </Alert>
                <Row className="justify-content-center">
                    <Card body style={{ padding: "20px", width: "50%" }}>
                        {getMultipleOptions(this.validateInput)}
                    </Card>
                </Row>
            </Container>
        );
    }
}

/**
 * 
 * @param {*} answers 
 * @param {*} questionCode 
 * @param {*} action 
 * @param {*} selectedAnswer 
 */
function getMultipleOptions(action) {
    let children = BRANDS.map((brand) => {
        return <Col md="auto" key={"id_" + brand}>
            <Row>
                <FormGroup check>
                    <Label check>
                        <Input value={brand} name="radio-button-demo" onChange={action.bind(this, brand)} type="checkbox" />{' '}
                        {brand}
                    </Label>
                </FormGroup>
                {/* <Checkbox
                    onChange={action.bind(this, brand)}
                    value={brand}
                    name="radio-button-demo"
                    inputProps={{ 'aria-label': 'A' }}
                    size={'small'}
                />
                <h5 style={{ margin: '0px', alignSelf: 'center' }}>{brand}</h5> */}
            </Row>
        </Col>
    });

    return (<Row><Col xs="auto">{children}</Col></Row>)
}

export default ThirdTask;