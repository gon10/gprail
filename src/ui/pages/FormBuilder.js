import React, { useState } from 'react';
import { faFont, faList, faCheckSquare, faDotCircle, faToggleOff, 
  faToggleOn, faParagraph, faCalculator, faCalendarAlt, faStopwatch, 
  faCalendarTimes, faClock, faEnvelope, faLink, faKey, faIdBadge, faHistory, 
  faCircle, faChevronLeft, faChevronRight, faHeading } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Button, Input, Textarea, Select, Checkbox, Radio, RadioGroup, Boolean } from '../base';
import Duration from '../components/Duration';
import Frequency from '../components/Frequency';
import OpeningHours from '../components/OpeningHours';

function Parameters(props) {

  return (
    <div className="form-builder__params__form">
      { ( typeof props.fields === "object" && props.fields.length > 0 ) ? <>
      { props.fields.includes("content") ? <Textarea name="content" label="Text content" rows="5" required 
        onChange={(e) => props.updateParameter(props.targetComponent, "content", e.target.value)} /> : null }
      { props.fields.includes("label") ? <Input name="label" label="Label" placeholder="Enter a label here" required 
        onChange={(e) => props.updateParameter(props.targetComponent, "label", e.target.value)} /> : null }
      { props.fields.includes("placeholder") ? <Input name="placeholder" label="Placeholder" placeholder="Enter placeholder text"
        onChange={(e) => props.updateParameter(props.targetComponent, "placeholder", e.target.value)} /> : null }
      { props.fields.includes("decimals") ? <Input name="decimals" label="Decimal Places" type="number" placeholder="0" min="0" max="10" 
        onChange={(e) => props.updateParameter(props.targetComponent, "decimals", e.target.value)} /> : null }
      { props.fields.includes("info") ? <Textarea name="info" label="Additional Information" rows="2" 
        onChange={(e) => props.updateParameter(props.targetComponent, "info", e.target.value)} /> : null }
      { props.fields.includes("error") ? <Input name="error" label="Error Message"  
        onChange={(e) => props.updateParameter(props.targetComponent, "error", e.target.value)} /> : null }

      { props.fields.includes("multiSelect") ? <Boolean name="multiSelect" label="Multi select input" inline 
        onChange={(e) => props.updateParameter(props.targetComponent, "multiSelect", e.target.value)} /> : null }
      { props.fields.includes("multiSelectLimit") ? <Input name="multiSelectLimit" label="Multi select limit" type="number" placeholder="0" min="0" 
        onChange={(e) => props.updateParameter(props.targetComponent, "multiSelectLimit", e.target.value)} /> : null }

      { props.fields.includes("setMinChars") ? <Boolean name="setMinChars" label="Set minimum character limit" inline 
        onChange={(e) => props.updateParameter(props.targetComponent, "setMinChars", e.target.value)} /> : null }
      { props.fields.includes("minChars") ? <Input name="minChars" label="Minimum Character Limit" type="number" placeholder="0" min="0" 
        onChange={(e) => props.updateParameter(props.targetComponent, "minChars", e.target.value)} /> : null }
      { props.fields.includes("setMaxChars") ? <Boolean name="setMaxChars" label="Set maximum character limit" inline 
        onChange={(e) => props.updateParameter(props.targetComponent, "setMaxChars", e.target.value)} /> : null }
      { props.fields.includes("maxChars") ? <Input name="maxChars" label="Maximum Character Limit" type="number" placeholder="255" min="0" 
        onChange={(e) => props.updateParameter(props.targetComponent, "maxChars", e.target.value)} /> : null }
      { props.fields.includes("setMin") ? <Boolean name="setMin" label="Set minimum value" inline 
        onChange={(e) => props.updateParameter(props.targetComponent, "setMin", e.target.value)} /> : null }
      { props.fields.includes("min") ? <Input name="min" label="Minimum Number" type="number" placeholder="0" 
        onChange={(e) => props.updateParameter(props.targetComponent, "min", e.target.value)} /> : null }
      { props.fields.includes("setMax") ? <Boolean name="setMax" label="Set maximum value" inline 
        onChange={(e) => props.updateParameter(props.targetComponent, "setMax", e.target.value)} /> : null }
      { props.fields.includes("max") ? <Input name="max" label="Maximum Number" type="number" placeholder="0" 
        onChange={(e) => props.updateParameter(props.targetComponent, "max", e.target.value)} /> : null }

      { props.fields.includes("required") ? <Boolean name="required" label="Is this input required?" inline 
        onChange={(e) => props.updateParameter(props.targetComponent, "required", e.target.value)} /> : null }
      { props.fields.includes("requiredText") ? <Input name="requiredText" label="Edit required error message" placeholder="This input is required" 
        onChange={(e) => props.updateParameter(props.targetComponent, "requiredText", e.target.value)} /> : null }
      { props.fields.includes("readOnly") ? <Boolean name="readOnly" label="Is this input read only?" inline 
        onChange={(e) => props.updateParameter(props.targetComponent, "readOnly", e.target.value)} /> : null }
      <div className="button-group">
        <Button action="tertiary" className="button--warning">Delete Input</Button>
        <Button action="tertiary">Clear Input</Button>
        <Button action="secondary" fullwidth>Update Input</Button>
      </div></>
      : <div className="form-builder__no-params">Please select a form element to edit parameters.</div> }
    </div>
  );
}

export default function FormBuilder(props) {
  const [showToolText, setShowToolText] = useState(true);
  const [parameters, setParameters] = useState([]);
  const [formContents, setFormContents] = useState([]);
  const [formSchema, setFormSchema] = useState([]);
  const [count, setCount] = useState(0);
  const [targetComponent, setTargetComponent] = useState();

  const defaultParameters = {
    h1 : ["content"],
    h3 : ["content"],
    paragraph : ["content"],
    textInput : [ "label", "placeholder", "info", "error", "setMinChars", "minChars", "setMaxChars", "maxChars", "required", "requiredText", "readOnly" ],
    numberInput : [ "label", "placeholder", "decimals", "info", "error", "setMin", "min", "setMax", "max", "required", "requiredText", "readOnly" ],
    paragraphInput : [ "label", "placeholder", "info", "error", "setMinChars", "minChars", "setMaxChars", "maxChars", "required", "requiredText", "readOnly" ],
    optionDropdown : [ "label", "placeholder", "info", "error", "multiSelect", "multiSelectLimit", "required", "requiredText", "readOnly" ],
    checkbox : [ "label", "placeholder", "info", "error", "required", "readOnly" ],
    radioButton : [ "label", "placeholder", "info", "error", "required", "requiredText", "readOnly" ],
    radioToggle : [ "label", "placeholder", "info", "error", "required", "requiredText", "readOnly" ],
    onOffSwitch : [ "label", "placeholder", "info", "error", "required", "requiredText", "readOnly" ],
    dateTime : [ "label", "placeholder", "info", "error", "required", "requiredText", "readOnly" ],
    duration : [ "label", "placeholder", "info", "error", "setMinChars", "minChars", "setMaxChars", "maxChars", "required", "requiredText", "readOnly" ],
    frequency : [ "label", "placeholder", "info", "error", "setMinChars", "minChars", "setMaxChars", "maxChars", "required", "requiredText", "readOnly" ],
    openingHours : [ "label", "placeholder", "info", "error", "setMinChars", "minChars", "setMaxChars", "maxChars", "required", "requiredText", "readOnly" ],
    email : [ "label", "placeholder", "info", "error", "required", "requiredText", "readOnly" ],
    url : [ "label", "placeholder", "info", "error", "required", "requiredText", "readOnly" ],
    password : [ "label", "placeholder", "info", "error", "setMinChars", "minChars", "setMaxChars", "maxChars", "required", "requiredText", "readOnly" ],
    uuid : [ "label", "placeholder", "info", "error", "required", "requiredText", "readOnly" ],
  };

  function addToForm(element) {
    const parameters = defaultParameters[element];
    setParameters(parameters);
    setCount(count+1);
    console.log(element);
    let component;
    let schemaSnippet;
    switch(element) {
      case 'h1':
        component = <h1 id={"new"+count} key={"new"+count}
          onClick={(e) => {
            setParameters(parameters);
            setTargetComponent(e.target.id);
          }}>New Form Title</h1>;
        schemaSnippet = {
          "uiComponentName": "h1",
          "boundFieldName": "new"+count
        };
        break;
      case 'h3':
        component = <h3 id={"new"+count} key={"new"+count}
          onClick={(e) => {
            setParameters(parameters);
            setTargetComponent(e.target.id);
          }}>New Section Title</h3>;
        schemaSnippet = {
          "uiComponentName": "h3",
          "boundFieldName": "new"+count
        };
        break;
      case 'paragraph':
        component = <p id={"new"+count} key={"new"+count}
          onClick={(e) => {
            setParameters(parameters);
            setTargetComponent(e.target.id);
          }}>New paragraph.</p>;
        schemaSnippet = {
          "uiComponentName": "paragraph",
          "boundFieldName": "new"+count
        };
        break;
      case 'textInput':
        component = <Input name={"new"+count} id={"new"+count} label={"New text input"} key={"new"+count} 
          onClick={(e) => {
            setParameters(parameters);
            setTargetComponent(e.target.id);
          }} />;
        schemaSnippet = {
          "uiComponentName": "textField",
          "boundFieldName": "new"+count,
          "isRequired": false,
          "minLength": null,
          "maxLength": null,
          "prompt": "New text input",
          "helpText": ""
        };
        break;
      case 'numberInput':
        component = <Input name={"new"+count} id={"new"+count} label={"New number input"} key={"new"+count} type="number" 
          onClick={(e) => {
            setParameters(parameters);
            setTargetComponent(e.target.id);
          }} />;
        schemaSnippet = {
          "uiComponentName": "integerField",
          "boundFieldName": "new"+count,
          "isRequired": false,
          "min": null,
          "max": null,
          "prompt": "New number input",
          "helpText": ""
        };
        break;
      case 'paragraphInput':
        component = <Textarea name={"new"+count} label={"New paragraph input"} key={"new"+count} rows="2" 
          onClick={(e) => {
            setParameters(parameters);
            setTargetComponent(e.target.id);
          }} />;
        schemaSnippet = {
          "uiComponentName": "paragraphField",
          "boundFieldName": "new"+count,
          "isRequired": false,
          "minLength": null,
          "maxLength": null,
          "prompt": "New paragraph input",
          "helpText": ""
        };
        break;
      case 'optionDropdown':
        component = <Select name={"new"+count} label={"New option dropdown"} key={"new"+count} options={['option1','option2']} 
          onClick={(e) => {
            setParameters(parameters);
            setTargetComponent(e.target.id);
          }} />;
        schemaSnippet = {
          "uiComponentName": "optionDropdown",
          "boundFieldName": "new"+count,
          "isRequired": false,
          "minLength": null,
          "maxLength": null,
          "prompt": "New option dropdown",
          "helpText": "",
          "options" : ['option1','option2'],
          "multiSelect" : false
        };
        break;
      case 'checkbox':
        component = <Checkbox name={"new"+count} label={"New checkbox"} key={"new"+count} 
          onClick={(e) => {
            setParameters(parameters);
            setTargetComponent(e.target.id);
          }} />;
        schemaSnippet = {
          "uiComponentName": "checkBoxField",
          "boundFieldName": "new"+count,
          "isRequired": false,
          "prompt": "New checkbox",
          "helpText": ""
        };
        break;
      case 'radioButton':
        component = <RadioGroup radioType="default" label={"New radio button"} key={"new"+count} 
          onClick={(e) => {
            setParameters(parameters);
            setTargetComponent(e.target.id);
          }}>
            <Radio name={"new"+count} label={"Option 1"} toggle={false} value="1" />
            <Radio name={"new"+count} label={"Option 2"} toggle={false} value="2" />
          </RadioGroup>;
        schemaSnippet = {
          "uiComponentName": "radioButtonGroup",
          "boundFieldName": "new"+count,
          "isRequired": false,
          "prompt": "New radio button",
          "helpText": ""
        };
        break;
      case 'radioToggle':
        component = <RadioGroup radioType="toggle" label={"New radio toggle"} key={"new"+count} 
          onClick={(e) => {
            setParameters(parameters);
            setTargetComponent(e.target.id);
          }} >
            <Radio name={"new"+count} label={"Option 1"} toggle={true} value="1" />
            <Radio name={"new"+count} label={"Option 2"} toggle={true} value="2" />
          </RadioGroup>;
        schemaSnippet = {
          "uiComponentName": "radioToggleGroup",
          "boundFieldName": "new"+count,
          "isRequired": false,
          "prompt": "New radio toggle",
          "helpText": ""
        };
        break;
      case 'onOffSwitch':
        component = <Boolean name={"new"+count} label={"New on/off switch"} key={"new"+count} 
          onClick={(e) => {
            setParameters(parameters);
            setTargetComponent(e.target.id);
          }} />;
        schemaSnippet = {
          "uiComponentName": "booleanField",
          "boundFieldName": "new"+count,
          "isRequired": false,
          "prompt": "New on/off switch",
          "helpText": ""
        };
        break;
      case 'dateTime':
        component = <Input name={"new"+count} id={"new"+count} label={"New date/time input"} type="datetime-local" key={"new"+count} 
          onClick={(e) => {
            setParameters(parameters);
            setTargetComponent(e.target.id);
          }} />;
        schemaSnippet = {
          "uiComponentName": "dateTimeField",
          "boundFieldName": "new"+count,
          "isRequired": false,
          "minDate": null,
          "maxDate": null,
          "prompt": "New date/time input",
          "helpText": ""
        };
        break;
      case 'duration':
        component = <Duration name={"new"+count} id={"new"+count} label={"New duration input"} key={"new"+count} 
          onClick={(e) => {
            setParameters(parameters);
            setTargetComponent(e.target.id);
          }} />;
        schemaSnippet = {
          "uiComponentName": "durationField",
          "boundFieldName": "new"+count,
          "isRequired": false,
          "prompt": "New duration input",
          "helpText": ""
        };
        break;
      case 'frequency':
        component = <Frequency name={"new"+count} id={"new"+count} label={"New frequency input"} key={"new"+count} 
          onClick={(e) => {
            setParameters(parameters);
            setTargetComponent(e.target.id);
          }} />;
        schemaSnippet = {
          "uiComponentName": "frequencyField",
          "boundFieldName": "new"+count,
          "isRequired": false,
          "prompt": "New frequency input",
          "helpText": ""
        };
        break;
      case 'openingHours':
        component = <OpeningHours name={"new"+count} id={"new"+count} label={"New opening hours input"} key={"new"+count} 
          onClick={(e) => {
            setParameters(parameters);
            setTargetComponent(e.target.id);
          }} />;
        schemaSnippet = {
          "uiComponentName": "openingHoursField",
          "boundFieldName": "new"+count,
          "isRequired": false,
          "prompt": "New opening hours input",
          "helpText": ""
        };
        break;
      case 'email':
        component = <Input name={"new"+count} id={"new"+count} label={"New email input"} key={"new"+count} type="email" 
          onClick={(e) => {
            setParameters(parameters);
            setTargetComponent(e.target.id);
          }} />;
        schemaSnippet = {
          "uiComponentName": "emailField",
          "boundFieldName": "new"+count,
          "isRequired": false,
          "minChars": null,
          "maxChars": null,
          "prompt": "New email input",
          "helpText": ""
        };
        break;
      case 'url':
        component = <Input name={"new"+count} id={"new"+count} label={"New URL input"} key={"new"+count} type="url" 
          onClick={(e) => {
            setParameters(parameters);
            setTargetComponent(e.target.id);
          }} />;
        schemaSnippet = {
          "uiComponentName": "urlField",
          "boundFieldName": "new"+count,
          "isRequired": false,
          "minChars": null,
          "maxChars": null,
          "prompt": "New URL input",
          "helpText": ""
        };
        break;
      case 'password':
        component = <Input name={"new"+count} id={"new"+count} label={"New password input"} key={"new"+count} type="password" 
          onClick={(e) => {
            setParameters(parameters);
            setTargetComponent(e.target.id);
          }} />;
        schemaSnippet = {
          "uiComponentName": "passwordField",
          "boundFieldName": "new"+count,
          "isRequired": false,
          "minChars": null,
          "maxChars": null,
          "prompt": "New password input",
          "helpText": ""
        };
        break;
      case 'uuid':
        component = <Input name={"new"+count} id={"new"+count} label={"New Unique User Id input"} key={"new"+count} type="text" 
          onClick={(e) => {
            setParameters(parameters);
            setTargetComponent(e.target.id);
          }} />;
        schemaSnippet = {
          "uiComponentName": "uuidField",
          "boundFieldName": "new"+count,
          "isRequired": false,
          "minChars": null,
          "maxChars": null,
          "prompt": "New Unique User Id input",
          "helpText": ""
        };
        break;
      default:
        component = <Input name={"new"+count} label={"New "+element} key={"new"+count} 
          onClick={(e) => {
            setParameters(parameters);
            setTargetComponent(e.target.id);
          }} />;
    }
    setFormContents([...formContents, component]);
    setFormSchema([...formSchema, schemaSnippet]);  
    setTargetComponent("new"+count);
    console.log(formSchema);
  }

  function updateParameter(targetComponent, parameter, paramValue) {
    console.log(targetComponent);
    console.log(parameter);
    console.log(paramValue);
  }

  return (
    <div className="form-builder__wrap">
      <div className="form-builder__header">
        <h2 className="form-builder__title">App Name <FontAwesomeIcon icon={faCircle} className="form-builder__title__icon" /> Form Builder <FontAwesomeIcon icon={faCircle} className="form-builder__title__icon" /> Form Name</h2>
        <div className="form-builder__button-group">
          <Button action="tertiary" className="form-builder__header__button">Clear Form</Button>
          <Button action="primary" className="form-builder__header__button">Save Form</Button>
          <Button action="primary" className="form-builder__header__button button--success">Publish Update</Button>
        </div>
      </div>
      <div className="form-builder">
        <div className={ showToolText ? "form-builder__tools" : "form-builder__tools form-builder__tools--collapse" }>
          <Button className="form-builder__tools__menu-toggle" action="tertiary" onClick={() => setShowToolText(!showToolText)} fullwidth>
            { showToolText ? <FontAwesomeIcon icon={faChevronLeft} /> : <FontAwesomeIcon icon={faChevronRight} /> }
          </Button>
          <ul className="form-builder__tools__ul">
            <li className="form-builder__tools__li">
              <button className="form-builder__tools__button" onClick={() => addToForm('h1')}>
                <span className="form-builder__tools__button__icon"><FontAwesomeIcon icon={faHeading} /></span>
                <span className={ showToolText ? "form-builder__tools__button__text" : "form-builder__tools__button__text--hide" }>Form Heading</span>
              </button>
            </li>
            <li className="form-builder__tools__li">
              <button className="form-builder__tools__button" onClick={() => addToForm('h3')}>
                <span className="form-builder__tools__button__icon"><FontAwesomeIcon icon={faHeading} /></span>
                <span className={ showToolText ? "form-builder__tools__button__text" : "form-builder__tools__button__text--hide" }>Section Heading</span>
              </button>
            </li>
            <li className="form-builder__tools__li">
              <button className="form-builder__tools__button" onClick={() => addToForm('paragraph')}>
                <span className="form-builder__tools__button__icon"><FontAwesomeIcon icon={faParagraph} /></span>
                <span className={ showToolText ? "form-builder__tools__button__text" : "form-builder__tools__button__text--hide" }>Paragraph Text</span>
              </button>
            </li>
            <li className="form-builder__tools__li">
              <button className="form-builder__tools__button" onClick={() => addToForm('textInput')}>
                <span className="form-builder__tools__button__icon"><FontAwesomeIcon icon={faFont} /></span>
                <span className={ showToolText ? "form-builder__tools__button__text" : "form-builder__tools__button__text--hide" }>Text Input</span>
              </button>
            </li>
            <li className="form-builder__tools__li">
              <button className="form-builder__tools__button" onClick={() => addToForm('numberInput')}>
                <span className="form-builder__tools__button__icon"><FontAwesomeIcon icon={faCalculator} /></span>
                <span className={ showToolText ? "form-builder__tools__button__text" : "form-builder__tools__button__text--hide" }>Number Input</span>
              </button>
            </li>
            <li className="form-builder__tools__li">
              <button className="form-builder__tools__button" onClick={() => addToForm('paragraphInput')}>
                <span className="form-builder__tools__button__icon"><FontAwesomeIcon icon={faParagraph} /></span>
                <span className={ showToolText ? "form-builder__tools__button__text" : "form-builder__tools__button__text--hide" }>Paragraph Input</span>
              </button>
            </li>
            <li className="form-builder__tools__li">
              <button className="form-builder__tools__button" onClick={() => addToForm('optionDropdown')}>
                <span className="form-builder__tools__button__icon"><FontAwesomeIcon icon={faList} /></span>
                <span className={ showToolText ? "form-builder__tools__button__text" : "form-builder__tools__button__text--hide" }>Option Dropdown</span>
              </button>
            </li>
            <li className="form-builder__tools__li">
              <button className="form-builder__tools__button" onClick={() => addToForm('checkbox')}>
                <span className="form-builder__tools__button__icon"><FontAwesomeIcon icon={faCheckSquare} /></span>
                <span className={ showToolText ? "form-builder__tools__button__text" : "form-builder__tools__button__text--hide" }>Checkbox</span>
              </button>
            </li>
            <li className="form-builder__tools__li">
              <button className="form-builder__tools__button" onClick={() => addToForm('radioButton')}>
                <span className="form-builder__tools__button__icon"><FontAwesomeIcon icon={faDotCircle} /></span>
                <span className={ showToolText ? "form-builder__tools__button__text" : "form-builder__tools__button__text--hide" }>Radio Button</span>
              </button>
            </li>
            <li className="form-builder__tools__li">
              <button className="form-builder__tools__button" onClick={() => addToForm('radioToggle')}>
                <span className="form-builder__tools__button__icon"><FontAwesomeIcon icon={faToggleOff} /></span>
                <span className={ showToolText ? "form-builder__tools__button__text" : "form-builder__tools__button__text--hide" }>Radio Toggle</span>
              </button>
            </li>
            <li className="form-builder__tools__li">
              <button className="form-builder__tools__button" onClick={() => addToForm('onOffSwitch')}>
                <span className="form-builder__tools__button__icon"><FontAwesomeIcon icon={faToggleOn} /></span>
                <span className={ showToolText ? "form-builder__tools__button__text" : "form-builder__tools__button__text--hide" }>On/Off Switch</span>
              </button>
            </li>
            <li className="form-builder__tools__li">
              <button className="form-builder__tools__button" onClick={() => addToForm('dateTime')}>
                <span className="form-builder__tools__button__icon"><FontAwesomeIcon icon={faCalendarAlt} /></span>
                <span className={ showToolText ? "form-builder__tools__button__text" : "form-builder__tools__button__text--hide" }>Date Time</span>
              </button>
            </li>
            <li className="form-builder__tools__li">
              <button className="form-builder__tools__button" onClick={() => addToForm('duration')}>
                <span className="form-builder__tools__button__icon"><FontAwesomeIcon icon={faStopwatch} /></span>
                <span className={ showToolText ? "form-builder__tools__button__text" : "form-builder__tools__button__text--hide" }>Duration</span>
              </button>
            </li>
            <li className="form-builder__tools__li">
              <button className="form-builder__tools__button" onClick={() => addToForm('frequency')}>
                <span className="form-builder__tools__button__icon"><FontAwesomeIcon icon={faCalendarTimes} /></span>
                <span className={ showToolText ? "form-builder__tools__button__text" : "form-builder__tools__button__text--hide" }>Frequency</span>
              </button>
            </li>
            <li className="form-builder__tools__li">
              <button className="form-builder__tools__button" onClick={() => addToForm('openingHours')}>
                <span className="form-builder__tools__button__icon"><FontAwesomeIcon icon={faClock} /></span>
                <span className={ showToolText ? "form-builder__tools__button__text" : "form-builder__tools__button__text--hide" }>Opening Hours</span>
              </button>
            </li>
            <li className="form-builder__tools__li">
              <button className="form-builder__tools__button" onClick={() => addToForm('email')}>
                <span className="form-builder__tools__button__icon"><FontAwesomeIcon icon={faEnvelope} /></span>
                <span className={ showToolText ? "form-builder__tools__button__text" : "form-builder__tools__button__text--hide" }>Email</span>
              </button>
            </li>
            <li className="form-builder__tools__li">
              <button className="form-builder__tools__button" onClick={() => addToForm('url')}>
                <span className="form-builder__tools__button__icon"><FontAwesomeIcon icon={faLink} /></span>
                <span className={ showToolText ? "form-builder__tools__button__text" : "form-builder__tools__button__text--hide" }>Web Address URL</span>
              </button>
            </li>
            <li className="form-builder__tools__li">
              <button className="form-builder__tools__button" onClick={() => addToForm('password')}>
                <span className="form-builder__tools__button__icon"><FontAwesomeIcon icon={faKey} /></span>
                <span className={ showToolText ? "form-builder__tools__button__text" : "form-builder__tools__button__text--hide" }>Password</span>
              </button>
            </li>
            <li className="form-builder__tools__li">
              <button className="form-builder__tools__button" onClick={() => addToForm('uuid')}>
                <span className="form-builder__tools__button__icon"><FontAwesomeIcon icon={faIdBadge} /></span>
                <span className={ showToolText ? "form-builder__tools__button__text" : "form-builder__tools__button__text--hide" }>Unique User ID</span>
              </button>
            </li>
          </ul>
        </div>
        <div className="form-builder__canvas">
          <div className="form-builder__page">
            {formContents}
          </div>
          <div className="form-builder__footer">
            <div className="form-builder__version-number">Form Name | Version 1.0.0</div>
            <div className="form-builder__footer__history"><button><FontAwesomeIcon icon={faHistory} /> Form history</button></div>
          </div>
        </div>
        <div className="form-builder__params">
          <Parameters fields={parameters} updateParameter={updateParameter} targetComponent={targetComponent} />
        </div>
      </div>
    </div>
  )
}