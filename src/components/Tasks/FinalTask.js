import React from 'react';

import { Container, Table, Alert, Card, CardBody, Button } from 'reactstrap';

import { ATTRIBUTE, TEXT_EMPTY, FIRST_TASK_PROPERTIES_TOTAL } from '../../helpers/constants';


class FinalTask extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedOption: Array(FIRST_TASK_PROPERTIES_TOTAL).fill(TEXT_EMPTY)
        }

        this.validateInput = this._validateInput.bind(this);
    }

    _validateInput(item) {
        const { selectedOption } = this.state

        this.props.action(item)

        selectedOption[this.props.counter - 1] = item

        this.setState({ selectedOption: selectedOption })
    }

    render() {
        return (
            <Container className="justify-content-md-center" key={this.props.counter}>
                {this.props.text}
                <Alert style={{ fontSize: "1.0rem" }} color="warning" isOpen={this.props.error.showError}>
                    <span className="alert-inner--text ml-1">
                        {this.props.error.textError}
                    </span>
                </Alert>
                <Card><CardBody style={{ padding:"20px", marginTop: "20px" }}>
                    {getTableProperty(this.validateInput, this.state.selectedOption[this.props.counter - 1], this.props.counter - 1)}
                </CardBody></Card>
            </Container>
        );
    }
}

/**
 * 
 * @param {*} selectedValue 
 * @param {*} counter 
 * @param {*} handleChange 
 */
function getTableProperty(validateInput, selectedValue, counter) {
    return (
        <Table bordered responsive>
            <thead>
                <tr>
                    <th></th>
                    <th className="align-middle" style={{ textAlign: 'center', padding: '7px' }}>
                        <h4>Preferencje (po prawej lepsze)</h4>
                    </th>
                    <th className="align-middle" style={{ textAlign: 'center', padding: '7px' }}>
                        <h4>Wybrane</h4>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className="align-middle" style={{ textAlign: 'center', padding: '7px' }}>
                        <h5>{ATTRIBUTE.data.text[counter]}</h5>
                    </td>
                    <td className="align-middle" style={{ textAlign: 'center', padding: '7px' }}>
                        <div>{getPropertiesTableBody(selectedValue, ATTRIBUTE.data.value[counter], validateInput)}</div>
                    </td>
                    <td className="align-middle" style={{ textAlign: 'center', padding: '7px' }}>
                        <h5>{getSelectedValueNameFormatted(counter, selectedValue)}</h5>
                    </td>
                </tr>
            </tbody>
        </Table>
    );
}

/**
 * 
 * @param {*} counter 
 * @param {*} selectedValue 
 */
function getSelectedValueNameFormatted(counter, selectedValue) {
    if (selectedValue !== TEXT_EMPTY)
        return ATTRIBUTE.data.prefix[counter] +
            ATTRIBUTE.data.value[counter][parseInt(selectedValue) - 1] + ATTRIBUTE.data.sufix[counter];
    else
        return "-"
}

/**
 * 
 * @param {*} selectedValue 
 * @param {*} data 
 * @param {*} handleChange 
 */
function getPropertiesTableBody(selectedValue, data, validateInput) {
    let children = data.map((item, i) => {
        return <Button id={"btn" + (i + 1)} key={"btn" + (i + 1)} onClick={validateInput.bind(this, i + 1)}
            color={parseInt(selectedValue) === (i + 1) ? "warning" : "primary"} //Values from 1 to length
            style={{ fontSize: "1.1em" }}>
            {item}
        </Button>
    });

    return children;
}

export default FinalTask;