import React from "react";

// reactstrap components
import { FormGroup, Form, Input, Container, Col, Label, Alert } from "reactstrap";

import NumberFormat from 'react-number-format';

import {
  FORM_SEX, FORM_AGE, FORM_PROFESSION, FORM_YEARS_EDUC, FORM_LEVEL_EDUC,
  FORM_LEVEL_EDUC_INITIAL, FORM_LEVEL_EDUC_MIDDLE, FORM_LEVEL_EDUC_SUPERIOR,
  FORM_LEVEL_EDUC_DEFAULT, FEMALE_VALUE, MALE_VALUE
} from '../../../helpers/constants';

import "./UserForm.css";

const DEBUG = (process.env.REACT_APP_DEBUG_LOG === "true") ? true : false;

class UserForm extends React.Component {
  constructor(props) {
    super(props);

    this.validateInput = this._validateInput.bind(this);
  }

  _validateInput(id, numberFormat) {
    let e = { target: { id: id, value: numberFormat.formattedValue } }
    this.props.action(e)
  }

  render() {
    if (DEBUG) console.log(this.props.data)
    return (
      <Container className="justify-content-center">
        <div className="text-center mt-2"><h3>Twoje dane</h3></div>
        <Alert style={{ fontSize: "1.0rem" }} color="warning" isOpen={this.props.error.showError}>
          <span className="alert-inner--text ml-1">
            {this.props.error.textError}
          </span>
        </Alert>
        <Form role="form" style={{ marginTop: '40px' }}>
          <FormGroup className="mb-3">
            <div className="d-flex align-items-left">
              <h5>Wiek</h5>
            </div>
            <NumberFormat className="form-control"
              id={FORM_AGE}
              placeholder=""
              autoFocus={true}
              onValueChange={this.validateInput.bind(this, FORM_AGE)}
              //value={this.props.data.age}
              decimalScale={0} />
          </FormGroup>
          <FormGroup className="mb-3">
            <div className="d-flex align-items-left">
              <h5>Zawód</h5>
            </div>
            <Input id={FORM_PROFESSION}
              placeholder=""
              onChange={this.props.action}
              type="text"
            // value={this.props.data.profession} 
            />
          </FormGroup>
          <FormGroup>
            <div className="d-flex align-items-left">
              <h5>Poziom wykształcenia</h5>
            </div>
            <Input type="select" name="select" id={FORM_LEVEL_EDUC} onChange={this.props.action}>
              <option value={FORM_LEVEL_EDUC_DEFAULT}>Wybierz...</option>
              <option value={FORM_LEVEL_EDUC_INITIAL}>podstawowe</option>
              <option value={FORM_LEVEL_EDUC_MIDDLE}>średnie</option>
              <option value={FORM_LEVEL_EDUC_SUPERIOR}>wyższe</option>
            </Input>
          </FormGroup>
          <FormGroup className="mb-3">
            <div className="d-flex align-items-left">
              <h5>Lata formalnej edukacji <small><i>(tylko etapy kończące się formalnym świadectwem: podstawowe, średnie, wyższe: np 8 lat szkoły podstawowej + 4 lata liceum = 12 lat)</i></small></h5>
            </div>
            <NumberFormat className="form-control"
              id={FORM_YEARS_EDUC}
              placeholder=""
              onValueChange={this.validateInput.bind(this, FORM_YEARS_EDUC)}
              //value={this.props.data.yearsEduc}
              decimalScale={0} />
          </FormGroup>
          <FormGroup tag="fieldset" className="mb-3">
            <div className="d-flex align-items-left">
              <h5>Płeć</h5>
            </div>
            <div style={{ display: "flex" }} >
              <Col lg="auto">
                <FormGroup>
                  <Label check>
                    <Input type="radio"
                      id={FORM_SEX}
                      name={FORM_SEX + "_F"}
                      value={FEMALE_VALUE}
                      onChange={this.props.action}
                      checked={this.props.data.sex === FEMALE_VALUE} />{' '}
                    Kobieta
                  </Label>
                </FormGroup>
              </Col>
              <Col lg="auto">
                <FormGroup>
                  <Label check>
                    <Input type="radio"
                      id={FORM_SEX}
                      name={FORM_SEX + "_M"}
                      value={MALE_VALUE}
                      onChange={this.props.action}
                      checked={this.props.data.sex === MALE_VALUE} />{' '}
                    Mężczyzna
                    </Label>
                </FormGroup>
              </Col>
            </div>
          </FormGroup>
        </Form>
      </Container>
    );
  }
}

export default UserForm;
