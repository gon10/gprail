import _uniqueId from 'lodash/uniqueId';
import React, { useEffect, useState } from 'react';
import { changeValueByPath } from '../../Helpers/utils';
import SingleOption from './SingleOption';
import { fetchAutocompleteOptions } from '../../Service/AutocompleteService';
import { createAuthService } from '../../Service/Factory';
const authService = createAuthService();


export default function DocumentLinkage(props) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [thisId] = useState(_uniqueId());
  const [value, setValue] = useState();
  const id = props.id ? props.id : thisId;
  let initialValue = ""
  if(props.methods){
      initialValue = global.structuredClone(props.methods.getValues(props.name));
    if(initialValue && Array.isArray(initialValue) && props.fieldsToShow){
      initialValue.forEach(element => {
        let fields = props.fieldsToShow.map(field => element[field]);
        if(fields.length > 0 && fields[0]){
          element.fieldsToShow = fields.join(" ");
        }
        // else{
        //   element.fieldsToShow = element.code
        // }
      
      });
    }
  }
  if(props.name && props.initialValues && props.fieldsToShow){
      initialValue = props.initialValues[props.name];
      if(initialValue && Array.isArray(initialValue)){
        initialValue.forEach(element => {
        element.fieldsToShow = props.fieldsToShow.map(field => element[field]).join(" ");
      });
    }
  }

  

  useEffect(() => {
    if(props.required){
      props.register(props.name, { value: initialValue, required:true, minLength:1 }) 
    }
    else{
      props.register(props.name, { value: initialValue }) 

    }
  }, [props])


  let result = JSON.stringify(props.error, function(key, val) {
    if (key !== "ref")
        return val;
  });

  let val= "";
  if(props.methods && props.methods.getValues){
    val = props.methods.getValues(props.name)
  }


  async function getCurrUserPlanningAssistantArea(){
    try {
      let currUser = authService.getUser();
      
      let user = await fetchAutocompleteOptions(currUser.email, "common-user", ["planningAssistantArea"], ["firstName", "lastName", "authenticationId", "tel"], 6 )
      user = user.data.data[0]
      // let userDetail = await getCommonUser(`${user._id.$oid}`);
      let planningAssistantArea = user.planningAssistantArea
      if (props.methods) {
          let values = props.methods.getValues();
          changeValueByPath(values, props.name, planningAssistantArea);
          props.setData(values);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // if(!val && props.name === "planningAssistantArea"){
      if(props.userProfileDefault && !val && props.name === "planningAssistantArea"){
        getCurrUserPlanningAssistantArea();
    }
  }, [])
  
  

  useEffect( () => {
    async function trigger() {
      if(props.methods && props.methods.trigger){
        await props.methods.trigger(props.name);
      }
    }
    trigger();
    
  }, [result, val])
  
  useEffect(() => {
    if(props.rhf){
      return 
    }
    
    props.unregister(props.name,{ keepDirty: true  });
    if(value){
      let extractedFieldsForUpdate = value.map(ele =>{let fieldsToShow = {}; props.fieldsToShow.forEach(field => fieldsToShow[field]=ele[field]);  return ({...fieldsToShow,refDoc: ele.refDoc, refDocCollection: props.refDocCollection, refDocVersion: ele.refDocVersion, })})
      props.register(props.name, { value: extractedFieldsForUpdate, required: true, minLength: 1 }) 
    }
    else{
      props.register(props.name, { value: [], required: true, minLength: 1 }) 
    }

  }, [value]);

  function loadOptions(inputValue, callback) {
      if(!inputValue){
        setIsLoaded(true);
        callback([])
        return 
      }
      fetchAutocompleteOptions(inputValue, props.refDocCollection, props.fetchFields, props.queryFields, props.autoCompleteLimit, props.queryFilter )
      .then(
        (response) => {
          setIsLoaded(true);
          if(response.data && response.data.success){
            let results = []
            if(props.fieldsToShow){
              response.data.data.forEach(item => {
                let fieldToShow = props.fieldsToShow.map(field => item[field]).join(" ");
                results.push({refDocVersion: item._version, ...item, refDoc: item._id, fieldsToShow: fieldToShow, value: fieldToShow, label: fieldToShow})
              });
            }
            else{
              response.data.data.forEach(item => {
                let fieldToShow = item[props.queryFields[0]];
                results.push({refDocVersion: item._version, ...item, refDoc: item._id, fieldsToShow: fieldToShow, value: fieldToShow, label: fieldToShow,})
              });
            }
            callback(results)
          }
          else{
            callback([])
          }
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
          console.log(error)
          
        }
      );
    }

  // let hasError = "";
  // if(props.methods && props.methods.formState.isSubmitted && props.methods.getFieldState && props.methods.getFieldState(props.name) && props.methods.getFieldState(props.name).error){
  //   hasError = props.methods.getFieldState(props.name).error 
  // }
  
  return (
    <>
      {error && <div className="error input__wrap">Error: {error.message}</div>}
      <SingleOption
        className={props.className}
        // error={hasError}
        id={id}
        name={props.name}
        label={props.label}
        helpText={props.helpText}
        displayType="async"
        fullWidth={false}
        isSearchable={true}
        loadOptions={loadOptions}
        disabled={props.disabled}
        value={  value ? 
          value.map(item => ({refDocVersion: item.refDocVersion, ...item, value: item.value, label: item.label,  }))
          : Array.isArray(initialValue) ? 
        initialValue.map(item => ({refDocVersion: item.refDocVersion, ...item, value: item.fieldsToShow, label: item.fieldsToShow,  }))
         : undefined }
        onChange={(item) => {
          let val;
          if(props.isMulti){
            val = item
          }else{
            val = item.slice(-1)
          }
          if (props.onChange) {
            props.onChange(val)
          }
          console.log("val", val)
          console.log("props.fieldsToShow", props.fieldsToShow)          
          let extractedFieldsForUpdate = val.map(ele =>{let fieldToShow = props.fieldsToShow.map(field => ele[field]).join(" ");  return ({...ele,fieldsToShow: fieldToShow,refDoc: ele.refDoc, refDocCollection: props.refDocCollection, refDocVersion: ele.refDocVersion, })})
          if(props.setData && props.methods){
            let copy = global.structuredClone(props.methods.getValues());
            changeValueByPath(copy, props.name, extractedFieldsForUpdate);
            if(props.additionalNameToChange){
              changeValueByPath(copy, props.additionalNameToChange, extractedFieldsForUpdate);
            }
            if(props.unsetOnChange){
              props.unsetOnChange.forEach(name => {
                if(name){
                  changeValueByPath(copy, name, "");
                }
                
              });
            }
            props.setData(copy);
          }
          else{
            setValue(extractedFieldsForUpdate)
          }
      
          } 
        }
        controlShouldRenderValue={false}
        isLoading={!isLoaded}
        placeholder={"Search..."}
        autoCompleteLimit={props.autoCompleteLimit}
        fetchFields={props.fetchFields}
        isMulti={true}
        queryFields={props.queryFields}
        refDocCollection={props.refDocCollection}
        required={props.required}
        methods={props.methods}
      />
    </>
  )
}