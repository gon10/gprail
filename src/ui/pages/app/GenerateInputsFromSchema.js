import React from "react";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//import { createImageContextImages } from '../../../Service/AttachmentService'
import { Boolean, InputRhf, Upload } from "../../base";
import BlockedLines from "../../components/BlockedLines";
import Card from "../../components/Card";
import CardDeck from "../../components/CardDeck";
import DataTable from "../../components/DataTable";
import DateTimeRange from "../../components/DateTimeRange";
import DocumentLinkage from "../../components/DocumentLinkage";
import EditableDocumentLinkage from "../../components/EditableDocumentLinkage";
import Elr from "../../components/Elr";
import EngineeringLocation from "../../components/EngineeringLocation";
import EngineeringLocationRange from "../../components/EngineeringLocationRange";
import ImageContext from "../../components/Image/ImageContext/ImageContext";
import LocationNesaGallery from "../../components/LocationNesaGallery";
import Mileage from "../../components/Mileage";
import MultipleOptions from "../../components/MultipleOptions";
import SingleOption from "../../components/SingleOption";
import TrackId from "../../components/TrackId";
import { makeSource } from "../../../Helpers/utils";
import UserField from "../../components/UserField";
import BusinessRef from "../../components/BusinessRef";
import { formatDate } from "../../../Helpers/StringHelpers";
import UserFieldDetails from "../../components/UserFieldDetails";
import ShiftsField from "../../components/ShiftsField";
import DateTimeField from "../../components/DateTimeField";

library.add(fas);


export default function GenerateInputsFromSchema(props) {
  const formElements = props.formElements;
  const initialValues = props.initialValues;
  const addInitialValues = props.addInitialValues;
  const items = props.items;
  const currentRecords = props.currentRecords ? props.currentRecords : [];
  const id = props.id;
  const apiCollectionName = props.apiCollectionName;
  const schema = props.schema;
  const viewStyle = props.viewStyle;
  const isLoaded = props.isLoaded;
  const defaultVals = props.defaultVals;

  let initialRows = 0;
  let inputs = [];

  formElements.map((input, key) => {
    
    const fieldName = input.boundFieldName ? input.boundFieldName : "";
    
    const label = input.prompt ? input.prompt : "Missing Label";
    const helpText = input.helpText ? input.helpText : "";
    const required = input.isRequired ? "This input is required" : false;
    const disabled = input.disabled
      ? input.disabled
      : input.readonly
      ? input.readonly
      : false;
    const minLength = input.minLength ? input.minLength : undefined;
    const maxLength = input.maxLength ? input.maxLength : undefined;
    const min = input.min || input.min === 0 ? input.min : undefined;
    //const max = input.max ? input.max : undefined;
    //const step = input.step ? input.step : undefined;
    const numRows = input.numRows ? input.numRows : undefined;
    //const noUnits = input.noUnits ? input.noUnits : false;
    const noLabel = input.noLabel ? input.noLabel : false;
    //const noTitle = input.noTitle ? input.noTitle : false;
    const options = input.options ? input.options : ["missing options"];
    const displayType = input.displayType ? input.displayType : undefined;
    const fullWidth = input.fullWidth ? input.fullWidth : false;
    const inline = input.inline ? input.inline : undefined;
    const right = input.right ? input.right : undefined;
    const isUniqueOnTable = input.isUniqueOnTable
      ? input.isUniqueOnTable
      : false;
    const collection = input.fieldCollection ? input.fieldCollection : null;
    const isUnique = input.isUnique ? input.isUnique : null;
    const fields = input.fields ? input.fields : null;
    const uploadFileLimit = input.uploadFileLimit
      ? input.uploadFileLimit
      : null;
    const accept = input.accept ? input.accept : null;
    const size = input.size ? input.size : "thumbnail";

    function getRecordsForField(fieldName, records) {
      let recordsForField = [];
      let thisFieldValue = items[fieldName];
      records.map(i => {
        if (i[fieldName] !== thisFieldValue) {
          return recordsForField.push(i[fieldName]);
        }
        return null;
      });
      return recordsForField;
    }

    const recordsForField = isUniqueOnTable
      ? getRecordsForField(fieldName, currentRecords)
      : [];

    let structure = { headers: [], rows: [] };

    const fieldType = uiComponentName => {
      switch (uiComponentName) {
        case "textField":
          return "input";
        case "integerField":
          return "input";
        case "booleanField":
          return "button";
        case "imageField":
          return "image";
        default:
          return "input";
      }
    };

    if (input.fields) {
      input.fields.map(field => {
        let fieldHeader = {
          Header: field.title
            ? field.title
            : field.prompt
            ? field.prompt
            : "Missing title",
          accessor: field.boundFieldName,
          type: fieldType(field.uiComponentName),
          required: field.isRequired
        };
        let fieldRow = {
          accessor: field.boundFieldName,
          component: field.uiComponentName,
          name: field.boundFieldName,
          value: "",
          defaultValue: field.default,
          required: field.isRequired,
          maxLength: field.maxLength,
          minLength: field.minLength,
          disabled: field.disabled,

          isUniqueOnTable: field.isUniqueOnTable,
          min: field.min
        };
        structure.headers.push(fieldHeader);
        structure.rows.push(fieldRow);
        return null;
      });
      //console.log(structure)
    }

    if (!id) {
      // add new item
      if (
        input.default !== "" ||
        input.default !== null ||
        input.default !== undefined
      )
        addInitialValues[fieldName] = input.default;
    }

    if (isLoaded) {
      initialValues[fieldName] = items[fieldName];
      if (Array.isArray(items[fieldName])) {
        initialRows = items[fieldName].length;
      }
    }

    if (input.uiComponentName) {
      switch (input.uiComponentName) {
        case "textField":
          inputs.push(
            <InputRhf
              key={key}
              type="text"
              name={fieldName}
              label={label}
              helpText={helpText}
              required={required}
              disabled={disabled}
              minLength={minLength}
              maxLength={maxLength}
              isUniqueOnTable={isUniqueOnTable}
              numRows={numRows}
              recordsForField={recordsForField}
              id={id}
              apiCollectionName={apiCollectionName}
              schema={schema}
              isUnique={isUnique}
              setData={props.setData}
              fullWidth={fieldName.includes("notes") ? true : false}

            />
          );
          break;
        case "integerField":
          inputs.push(
            <InputRhf
              key={key}
              type="number"
              name={fieldName}
              label={label}
              helpText={helpText}
              required={required}
              disabled={disabled}
              minLength={minLength}
              maxLength={maxLength}
              isUniqueOnTable={isUniqueOnTable}
              recordsForField={recordsForField}
              apiCollectionName={apiCollectionName}
              min={min}
              isUnique={isUnique}
            />
          );
          break;
        case "emailField":
          inputs.push(
            <InputRhf
              key={key}
              type="email"
              name={fieldName}
              label={label}
              helpText={helpText}
              required={required}
              disabled={disabled}
            />
          );
          break;
        case "telephoneField":
          inputs.push(
            <InputRhf
              key={key}
              type="tel"
              name={fieldName}
              label={label}
              helpText={helpText}
              required={required}
              disabled={disabled}
            />
          );
          break;
        case "temporalField":
          inputs.push(
            <DateTimeRange
              key={key}
              name={fieldName}
              label={label}
              helpText={helpText}
              required={required}
              disabled={disabled}
            />
          );
          break;
        case "singleOptionField":
          inputs.push(
            <SingleOption
              key={key}
              name={fieldName}
              label={label}
              helpText={helpText}
              required={required}
              disabled={disabled}
              displayType={displayType}
              options={options}
              fullWidth={fullWidth}
              setData={props.setData}
            />
          );
          break;
        case "multipleOptionsField":
          inputs.push(
            <MultipleOptions
              key={key}
              name={fieldName}
              label={label}
              helpText={helpText}
              required={required}
              disabled={disabled}
              displayType={displayType}
              options={options}
              fullWidth={fullWidth}
              setData={props.setData}
            />
          );
          break;
        case "booleanField":
          inputs.push(
            <Boolean
              key={key}
              name={fieldName}
              label={label}
              helpText={helpText}
              required={required}
              disabled={disabled}
              displayType={displayType}
              options={options}
              fullWidth={fullWidth}
              inline={inline}
              right={right}
            />
          );
          break;
        case "attachmentField":
          inputs.push(
            <Upload
              key={key}
              name={fieldName}
              label={label}
              helpText={helpText}
              required={required}
              disabled={disabled}
              uploadFileLimit={uploadFileLimit}
              accept={accept}
              setData={props.setData}
              disablePreview
            />
          );
          break;
        case "editableField":
          inputs.push(
            <DataTable
              key={key}
              name={fieldName}
              label={label}
              helpText={helpText}
              required={required}
              disabled={disabled}
              noLabel={noLabel}
              structure={structure}
              initialRows={initialRows}
              tabletView={viewStyle === "tablet" ? true : false}
              mobileView={viewStyle === "mobile" ? true : false}
              fullWidth={true}
            />
          );
          break;
        case "documentLinkageField":
          inputs.push(
            <DocumentLinkage
              key={key}
              name={fieldName}
              label={label}
              helpText={helpText}
              required={required}
              disabled={disabled}
              autoCompleteLimit={input.autoCompleteLimit}
              fetchFields={input.fetchFields}
              isMulti={input.isMultiSelect}
              queryFields={input.queryFields}
              queryFilter={input.queryFilter}
              refDocCollection={input.refDocCollection}
              // initialValues={initialValues}
              fieldsToShow={input.fieldsToShow}
              setData={props.setData}
              userProfileDefault={input.userProfileDefault}
              rhf
              //dynamicQueryFilter={input.dynamicQueryFilter} //toDo: gets information for the filter from elsewhere in the form to fire the filter again on an autocomplete field with new search parameters
            />
          );
          break;
        case "editableDocumentLinkageField":
          inputs.push(
            <EditableDocumentLinkage
              key={key}
              name={fieldName}
              label={label}
              helpText={helpText}
              required={required}
              disabled={disabled}
              noLabel={noLabel}
              condensed={true}
              //structure={structure}
              initialRows={initialRows}
              tabletView={viewStyle === "tablet" ? true : false}
              mobileView={viewStyle === "mobile" ? true : false}
              fullWidth={true}
              collection={collection}
              fields={fields}
              linkedDocuments={initialValues}
              defaultVals={defaultVals}
              setData={props.setData}
              rhf
            />
          );
          break;

        case "mileageField":
          inputs.push(
            <Mileage
              key={key}
              name={fieldName}
              label={label}
              helpText={helpText}
              required={required}
              disabled={disabled}
              autoCompleteLimit={6}
              fetchFields={["elrCode"]}
              isMulti={false}
              queryFields={["elrCode"]}
              refDocCollection="network-gbr-ELRs"
              initialValues={initialValues}
              fieldsToShow={["elrCode"]}
            />
          );
          break;
        case "elrField":
          inputs.push(
            <Elr
              key={key}
              name={fieldName}
              label={label}
              helpText={helpText}
              required={required}
              disabled={disabled}
              initialValues={initialValues}
            />
          );
          break;
        case "trackIdField":
          inputs.push(
            <TrackId
              key={key}
              name={fieldName}
              label={label}
              helpText={helpText}
              required={required}
              disabled={disabled}
              initialValues={initialValues}
            />
          );
          break;
        case "engineeringLocationField":
          inputs.push(
            <EngineeringLocation
              key={key}
              name={fieldName}
              label={label}
              helpText={helpText}
              required={required}
              disabled={disabled}
              initialValues={initialValues}
              trackId={true}
            />
          );
          break;
        case "engineeringLocationRangeField":
          inputs.push(
            <EngineeringLocationRange
              key={key}
              name={fieldName}
              label={label}
              helpText={helpText}
              required={required}
              disabled={disabled}
              initialValues={initialValues}
              trackId={true}
            />
          );
          break;
        case "blockedLines":
          inputs.push(
            <BlockedLines
              key={key}
              name={fieldName}
              label={label}
              helpText={helpText}
              required={required}
              disabled={disabled}
              initialValues={initialValues}
              trackId={true}
              showOpenLines={input.showOpenLines}
              showDirection={input.showDirection}
              showElectrification={input.showElectrification}
              showSpeed={input.showSpeed}
              showELRInfo={input.showELRInfo}
              showAdditionalSignals={input.showAdditionalSignals}
              showDisconnectionPoints={input.showDisconnectionPoints}
              showProtectionLimits={input.showProtectionLimits}
              setData={props.setData}
              data={props.data}
              maxLines={input.maxLines}
              maxELrs={input.maxELrs}
            />
          );
          break;
        case "imageContext":
          const data = props.data;
          const file = data ? data[input.boundFieldName] : null;
          const src = makeSource(file);
          const path = src ? src.split("/").pop() : null;
          const attachmentId = path ? path.split(".")[0] : null;
          const title = label || fieldName

          const images = [
            {
              src: src,
              alt: title,
              id: attachmentId,
              title
            },
          ];

          if (attachmentId) {
            inputs.push(
              <ImageContext
                id={attachmentId}
                key={attachmentId}
                alt={images[0].alt}
                src={images[0].src}
                images={images}
                disabled={false}
                size={size}
                type={input.displayAs}
                helpText={input.helperText}
              />
            );
          }

          break;

        case "locationNesaGallery":
          inputs.push(
            <LocationNesaGallery
              // key={'edl'+i+key}
              key={key}
              name={fieldName}
              data={items}
              input={input}
            />
          );
          break;
        case "userField":

          inputs.push(
              <UserField
                  key={key}
                  name={fieldName}
                  label={label}
                  helpText={helpText}
                  required={required}
                  disabled={disabled}
                  autoCompleteLimit={input.autoCompleteLimit}
                  fetchFields={input.fetchFields}
                  isMulti={input.isMultiSelect}
                  queryFields={input.queryFields}
                  queryFilter={input.queryFilter}
                  refDocCollection={input.refDocCollection}
                  // initialValues={initialValues}
                  fieldsToShow={input.fieldsToShow}
                  setData={props.setData}
                  rhf
                  hidden={input.hidden}
                  isCurrentUserDefault={input.isCurrentUserDefault}
              />

            
          );

          inputs.push(
            <UserFieldDetails
            key={`${key}UserFieldDetails`}
                name={fieldName}
            />

          
        );
          break;

          case "shiftsField":
          inputs.push(
              <ShiftsField
                  key={key}
                  name={fieldName}
                  label={label}
                  helpText={helpText}
                  required={required}
                  disabled={disabled}
                  // initialValues={initialValues}
                  setData={props.setData}
                  hidden={input.hidden}
              />
          );

          break;

          case "dateTimeField":
          inputs.push(
              <DateTimeField
                  key={key}
                  name={fieldName}
                  label={label}
                  helpText={helpText}
                  required={required}
                  disabled={disabled}
                  // initialValues={initialValues}
                  setData={props.setData}
              />
          );

          break;

        case "autoBusinessReferenceField":
          inputs.push(
            <BusinessRef
              // key={'edl'+i+key}
              id={id}
              key={key}
              name='applicationId'
              data={items}
              input={input}
              apiCollectionName={apiCollectionName}
              setData={props.setData}
            />
          );
          break;
        case "cardDeck":
          let cards = [];
          if (input.cards) {
            input.cards.map((card, i) => {
              let content = [];
              if (card.cardContent) {
                card.cardContent.map((contentItem, k) => {
                  if (contentItem.cardParagraph) {
                    content.push(
                      <p className="card__p" key={k}>
                        {items[contentItem.cardParagraph.boundField]}
                      </p>
                    );
                  } else if (contentItem.cardList) {
                    content.push(
                      <ul className="card__ul" key={k}>
                        {contentItem.cardList.map((item, i) => {
                          switch (item.fieldType) {
                            case "documentLinkage":
                              const docLinkInfo = item.fieldsToDisplay.map(
                                field => {
                                  if (items[item.boundField]) {
                                    return `${
                                      items[item.boundField][0][field]
                                    } `;
                                  }
                                  return null;
                                }
                              );
                              return (
                                <li className="card__li" key={i}>
                                  <FontAwesomeIcon icon={["fas", "link"]} />{" "}
                                  <b>{item.label}:</b>{" "}
                                  <span>{docLinkInfo}</span>
                                </li>
                              );
                            case "dateRange":
                              if (items[item.boundField]) {
                                const from = formatDate(
                                  items[item.boundField].from
                                );
                                const until = formatDate(
                                  items[item.boundField].until
                                );
                                const dateRange = (
                                  <span>
                                    <b>From:</b> {from} <b>Until:</b> {until}
                                  </span>
                                );
                                return (
                                  <li className="card__li" key={i}>
                                    <FontAwesomeIcon
                                      icon={["fas", "calendar-days"]}
                                    />{" "}
                                    <b>{item.label}:</b> {dateRange}
                                  </li>
                                );
                              }
                              break;
                            default:
                              const icon = item.fieldIcon ? (
                                <FontAwesomeIcon
                                  icon={["fas", item.fieldIcon]}
                                />
                              ) : (
                                <FontAwesomeIcon icon={["fas", "square"]} />
                              );
                              const fieldContent =
                                item.linkType === "email" ? (
                                  <a href={`mailto:${items[item.boundField]}`}>
                                    {items[item.boundField]}
                                  </a>
                                ) : item.linkType === "phone" ? (
                                  <a href={`tel:${items[item.boundField]}`}>
                                    {items[item.boundField]}
                                  </a>
                                ) : (
                                  <span>{items[item.boundField]}</span>
                                );
                              return (
                                <li className="card__li" key={i}>
                                  {icon} <b>{item.label}:</b> {fieldContent}
                                </li>
                              );
                          }
                          return null;
                        })}
                      </ul>
                    );
                  }
                  return null;
                });
              }

              cards.push(
                <Card
                  key={i}
                  title={items[card.cardTitleField]}
                  subTitle={items[card.cardSubTitleField]}
                  content={content}
                  disabled={card.disabled}
                  footer={card.cardFooter}
                  width={card.cardWidth}
                />
              );
              return null;
            });
          }

          inputs.push(<CardDeck key={`deck-${key}`}>{cards}</CardDeck>);
          break;

        default:
          inputs.push(
            <p className="input__wrap" key={key}>
              Input type not found
            </p>
          );
      }
    } else {
      inputs.push(
        <InputRhf
          key={key}
          type="text"
          name={fieldName}
          label={label}
          helpText={helpText}
          required={required}
          disabled={disabled}
          minLength={minLength}
          maxLength={maxLength}
        />
      );
    }
    return null;
  });

  return inputs;
}
