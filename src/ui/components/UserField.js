import React, { useEffect } from "react";
import DocumentLinkage from "./DocumentLinkage";
import { createAuthService } from "../../Service/Factory";
import { changeValueByPath } from "../../Helpers/utils";
import { fetchAutocompleteOptions } from "../../Service/AutocompleteService";
const authService = createAuthService();

export default function UserField({ register, methods, errors, ...props }) {
  const getCurrUser = async () => {
    try {
      let currUser = authService.getUser();
      
      let user = await fetchAutocompleteOptions(currUser.email, "common-user", props.fetchFields, props.queryFields, props.autoCompleteLimit, props.queryFilter )
      user = user.data.data[0]
      
      user.refDocVersion= user._version; 
      user.refDoc= user._id
      user.refDocCollection = "common-user"
      
      if (methods && props.setData && props.isCurrentUserDefault) {
        let userVal = methods.getValues(props.name);        
        if (!userVal || userVal.length === 0) {
          let values = methods.getValues();
          let copy = global.structuredClone(values);
          changeValueByPath(copy, props.name, [user]);
          props.setData(copy);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    getCurrUser();
  }, []);

  const userFieldProps = {
    // className: "blocked-lines__input blocked-lines__signal-panel-from",
    name: props.name,
    label: props.label,
    helpText: props.helpText,
    required: props.required,
    disabled: props.disabled,
    noLabel: props.noLabel,
    noMargin: props.noMargin,
    autoCompleteLimit: props.autoCompleteLimit,
    fetchFields: props.fetchFields,
    fieldsToShow: props.fieldsToShow,
    isMulti: props.isMulti,
    queryFields: props.queryFields,
    queryFilter: props.queryFilter,
    refDocCollection: "common-user",
    register: register,
    methods: methods,
    errors: errors,
    unregister: methods.unregister
  };
  return (
    <>
      {!props.hidden ? (

            <DocumentLinkage
              {...userFieldProps}
              setData={props.setData}
              data={props.data}
              rhf
            />
        
      ) : (
        ""
      )}
    </>
  );
}
