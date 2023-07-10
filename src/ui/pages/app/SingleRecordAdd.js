import React, { useEffect } from 'react';
import { Button, Form } from '../../base'
import MultiStepForm from '../../components/MultiStepForm'

export default function SingleRecordAdd(props) {
  const description = props.description ? props.description : "No form description provided.";
  const onCreate = props.onCreate ? props.onCreate : function () { console.log("No onCreate function provided") };
  const defaultValues = props.defaultValues ? props.defaultValues : "";
  const inputs = props.inputs ? props.inputs : [];
  const config = props.config ? props.config : [];
  const cols = props.cols ? props.cols : 3;

  const initialValues = props.initialValues
  const addInitialValues = props.addInitialValues
  const items = props.items
  const currentRecords = props.currentRecords
  const id = props.id
  const apiCollectionName = props.apiCollectionName
  const schema = props.schema
  const viewStyle = props.viewStyle
  const isLoaded = props.isLoaded
  const defaultVals = props.defaultVals
  const data = props.data
  const setData = props.setData

  useEffect(() => {
    props.setData({})
  }, [props.setData])

  const formFooter = <>
    <Button action="primary">Create Record</Button>
  </>;

  return (
    <div className="app__page__tab tab-2">
      {config.pages && config.pages.length > 1 ?
        <MultiStepForm
          onSubmit={onCreate}
          title="Create Record"
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
          defaultVals={defaultVals}
          data={data}
          setData={setData}
        />
        : <Form
          onSubmit={onCreate}
          title="Create Record"
          description={description}
          columns={cols}
          border={true}
          square={true}
          footer={formFooter}
          defaultValues={defaultValues}>
          {inputs}
        </Form>}
    </div>
  )
};