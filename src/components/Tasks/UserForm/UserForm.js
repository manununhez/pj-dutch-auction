import React from "react";

// reactstrap components
import { FormGroup, Form, Input, Container, Col, Label, Alert } from "reactstrap";

import NumberFormat from 'react-number-format';

import {
  FORM_SEX, FORM_AGE, FORM_PROFESSION, FORM_YEARS_EDUC, FORM_LEVEL_EDUC,
  FORM_LEVEL_EDUC_INITIAL, FORM_LEVEL_EDUC_MIDDLE, FORM_LEVEL_EDUC_SUPERIOR,
  FORM_LEVEL_EDUC_DEFAULT, FEMALE_VALUE, MALE_VALUE, EVENT_KEY_DOWN, TEXT_EMPTY,
  ENTER_KEY_CODE
} from '../../../helpers/constants';

import "./UserForm.css";

const DEBUG = (process.env.REACT_APP_DEBUG_LOG === "true") ? true : false;

class UserForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {
        sex: FEMALE_VALUE,//default selected sex
        age: TEXT_EMPTY,
        yearsEduc: TEXT_EMPTY,
        levelEduc: FORM_LEVEL_EDUC_DEFAULT, //default selected 
        profession: TEXT_EMPTY
      }
    }
    this.validateNumberFormat = this._validateNumberFormat.bind(this);
    this.handleKeyDownEvent = this._handleKeyDownEvent.bind(this);
    this.validateInputForm = this._validateInputForm.bind(this)
  }

  componentDidMount() {
    //for keyboard detection
    document.addEventListener(EVENT_KEY_DOWN, this.handleKeyDownEvent, false);
  }

  componentWillUnmount() {
    document.removeEventListener(EVENT_KEY_DOWN, this.handleKeyDownEvent, false);
  }

  _handleKeyDownEvent(event) {
    if (event.keyCode === ENTER_KEY_CODE) {
      this.props.action(this.state.formData)
    }
  }

  _validateInputForm(evt) {
    const formId = evt.target.id;
    const formInputValue = evt.target.value;

    let { formData } = this.state

    if (DEBUG) console.log(formId)
    if (DEBUG) console.log(formInputValue)

    //We save all fields from form data 
    if (formId === FORM_SEX) {
      formData.sex = formInputValue
    } else if (formId === FORM_AGE) {
      formData.age = formInputValue
    } else if (formId === FORM_PROFESSION) {
      formData.profession = formInputValue
    } else if (formId === FORM_YEARS_EDUC) {
      formData.yearsEduc = formInputValue
    } else if (formId === FORM_LEVEL_EDUC) {
      formData.levelEduc = formInputValue
    }

    this.setState({ formData: formData })
  }

  _validateNumberFormat(id, numberFormat) {
    let e = { target: { id: id, value: numberFormat.formattedValue } }
    this._validateInputForm(e)
  }

  render() {
    const { formData } = this.state
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
              onValueChange={this.validateNumberFormat.bind(this, FORM_AGE)}
              decimalScale={0} />
          </FormGroup>
          <FormGroup className="mb-3">
            <div className="d-flex align-items-left">
              <h5>Zawód</h5>
            </div>
            <Input id={FORM_PROFESSION}
              placeholder=""
              onChange={this.validateInputForm}
              type="text"
            />
          </FormGroup>
          <FormGroup>
            <div className="d-flex align-items-left">
              <h5>Poziom wykształcenia</h5>
            </div>
            <Input type="select" name="select" id={FORM_LEVEL_EDUC} onChange={this.validateInputForm}>
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
              onValueChange={this.validateNumberFormat.bind(this, FORM_YEARS_EDUC)}
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
                      onChange={this.validateInputForm}
                      checked={formData.sex === FEMALE_VALUE} />{' '}
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
                      onChange={this.validateInputForm}
                      checked={formData.sex === MALE_VALUE} />{' '}
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
