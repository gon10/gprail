import React from 'react';
import { Button, Form } from '../../base'
import MultiStepForm from '../../components/MultiStepForm'

export default function SingleRecordEdit(props) {
  const description = props.description ? props.description : "No form description provided.";
  const onUpdate = props.onUpdate ? props.onUpdate : function () { console.log("No onUpdate function provided") };
  const defaultValues = props.defaultValues
  const inputs = props.inputs ? props.inputs : [];
  const config = props.config ? props.config : [];
  const cols = props.cols ? props.cols : 3;
  const viewStyle = props.viewStyle

  const initialValues = props.initialValues
  const addInitialValues = props.addInitialValues
  const items = props.items
  const currentRecords = props.currentRecords
  const id = props.id
  const apiCollectionName = props.apiCollectionName
  const schema = props.schema
  const isLoaded = props.isLoaded
  const data = props.data
  const setData = props.setData

  const formFooter = <Button action="primary">Update Record</Button>;

  //console.log(props)

  return (
    <div className="app__page__tab tab-2">
      {config.pages && config.pages.length > 1 ?
        <MultiStepForm
          onSubmit={onUpdate}
          title="Edit Record"
          description={description}
          columns={cols}
          border={true}
          square={true}
          footer={formFooter}
          defaultValues={defaultValues}
          config={config}
          initialValues={initialValues}
          addInitialValues={addInitialValues}
          items={items}
          currentRecords={currentRecords}
          id={id}
          apiCollectionName={apiCollectionName}
          schema={schema}
          viewStyle={viewStyle}
          isLoaded={isLoaded}
          data={data}
          setData={setData}
        />
        : <Form
          onSubmit={onUpdate}
          title="Edit Record"
          description={description}
          columns={cols}
          border={true}
          square={true}
          footer={formFooter}
          defaultValues={defaultValues}
          viewStyle={viewStyle}
        >
          {inputs}
        </Form>}
    </div>
  )
};