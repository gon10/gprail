import React, { Suspense, useState } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";

import MultiStepBar from "./MultiStepBar";
import Form from "../base/Form";
import Button from "../base/Button";
import GenerateInputsFromSchema from '../pages/app/GenerateInputsFromSchema'

export default function MultiStepForm(props) {
  const [targetPage, setTargetPage] = useState();

  const config = props.config ? props.config : null;
  const iconShape = config.iconShape ? config.iconShape : null;
  const initialValues = props.initialValues
  const addInitialValues = props.addInitialValues
  const items = props.items
  const currentRecords = props.currentRecords
  const id = props.id
  const apiCollectionName = props.apiCollectionName
  const schema = props.schema
  const viewStyle = props.viewStyle
  const isLoaded = props.isLoaded
  const defaultValues = props.defaultValues
  const data = props.data
  const setData = props.setData
  const onSubmit = props.onSubmit

  const navigate = useNavigate()

  function onProgress(data, targetPage) {
    // setData(data)
    if (targetPage) {
      navigate(targetPage);
    }
  }

  let pages = [];
  let steps = [];
  config.pages.map((page, i) => {
    const prevPage = config.pages[i-1]? config.pages[i-1].pageHeader.pageNavigation.link : null;
    const nextPage = config.pages[i+1]? config.pages[i+1].pageHeader.pageNavigation.link : null;
    steps.push(page.pageHeader.pageNavigation);

    const inputProps = {
      formElements:  page.pageElements,
      initialValues: initialValues,
      addInitialValues: addInitialValues,
      items: items,
      currentRecords: currentRecords,
      id: id,
      apiCollectionName: apiCollectionName,
      schema: schema,
      viewStyle: viewStyle,
      isLoaded: isLoaded,
      defaultVals: defaultValues,
      data: data,
      setData: setData,
      page: page
    }
  
    const inputs = GenerateInputsFromSchema(inputProps)

    pages.push(<Route key={i} path={page.pageHeader.pageNavigation.link} element={
      <Form
        onSubmit={(i+1 === config.pages.length)? onSubmit : (data) => onProgress(data, targetPage)}
        title={page.pageHeader.pageTitle}
        description={page.pageHeader.pageDescription}
        footer={
          <>
            {(i+1 === config.pages.length)? 
            <Button action="secondary" 
              onClick={(e, data) => {
                e.preventDefault()
                // setData(data)
                navigate(prevPage)
              }
              }>&lt; Previous Section</Button> :
            prevPage? <Button action="secondary" onClick={() => {setTargetPage(prevPage)}}>&lt; Previous Section</Button> : <span></span>}
            {nextPage? <Button action="primary" onClick={() => {setTargetPage(nextPage)}}>Continue &gt;</Button> : 
            <Button action="primary">Save &amp; Finish</Button>}
          </>
        }
        disabled={page.pageHeader.pageNavigation.disabled}
        border={true}
        square={props.square ? props.square : true}
        defaultValues={defaultValues}
        columns={["mileage", "protection"].includes(page.pageHeader.pageNavigation.link) ? "1" : page.pageHeader.pageNavigation.link === "about" ? "3" : "2"}>

        {inputs}
      </Form>} />)
    return null;
  });

  let classProps = ['multi-step-form'];
  if (props.square) { classProps.push('multi-step-form--square') }
  if (props.disabled) { classProps.push('multi-step-form--disabled') }
  if (props.className) { classProps.push(props.className) }

  return (
    <div className={classProps.join(' ')} >
        <MultiStepBar steps={steps} iconShape={iconShape} square={props.square} onProgress={onProgress} data={data} />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {pages}
          </Routes>
        </Suspense>
        {props.children}
    </div>
  )
};