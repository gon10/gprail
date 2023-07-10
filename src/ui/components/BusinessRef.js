import React, { useState, useEffect } from "react";
import { changeValueByPath } from "../../Helpers/utils";
import Input from "../base/InputRhf";
import { propertyUnique } from "../../Service/DocumentService";

export default function BusinessRef({ register, methods, errors, ...props }) {
  const [value, setValue] = useState("");
  const [isUnique, setIsUnique] = useState(false);

  let classProps = ["blocked-lines__column-display", "blocked-lines__section"];
  if (props.disabled) {
    classProps.push("blocked-lines__wrap--disabled");
  }
  if (props.className) {
    classProps.push(props.className);
  }
  if (props.error) {
    classProps.push("blocked-lines__wrap--error");
  }
  if (props.noLabel) {
    classProps.push("blocked-lines__wrap--no-label");
  }
  if (props.noMargin) {
    classProps.push("blocked-lines__wrap--no-margin");
  }

  const fieldProps = {
    id: props.id,
    name: "applicationId",
    className: "blocked-lines__input blocked-lines__protection-system-form",
    label: "Business Reference",
    helpText: "",
    disabled: true,
    fullWidth: true,
    readonly: true,
    noLabel: props.noLabel,
    noMargin: props.noMargin,
    setData: props.setData,
    isMulti: false,
    register: register,
    methods: methods,
    errors: errors,
    apiCollectionName: props.apiCollectionName,
    unregister: methods.unregister,
    value
  };

  useEffect(() => {
    if (props.data.applicationId) {
      const { applicationId } = props.data;
      let copy = global.structuredClone(methods.getValues());

      changeValueByPath(copy, "applicationId", applicationId);
      props.setData(copy);
      setValue(applicationId);
    } else if (!isUnique) {
      const typeMethodMapping = {
        text(value) {
          return value;
        },
        planningYear() {
          const createdDate = new Date(
            props.data && props.data.documentHistory
              ? props.data.documentHistory[0].when
              : new Date().toISOString()
          );
          const createdMonth = createdDate.getMonth();
          const createdYear =
            createdMonth <= 3
              ? createdDate.getFullYear() - 1
              : createdDate.getFullYear();

          return createdYear;
        },
        randomNumbers(limit) {
          return Math.round(Math.random() * Math.pow(10, Number(limit)));
        }
      };

      let generatedText = "";
      props.input.parts.forEach(({ type, limit, value }) => {
        const result = typeMethodMapping[type](type === "text" ? value : limit);
        generatedText += result;
      });

      setValue(generatedText);

      let copy = global.structuredClone(methods.getValues());

      changeValueByPath(copy, "applicationId", generatedText);
      props.setData(copy);
    }
  }, [isUnique, props.input, props.data]);

  useEffect(() => {
    if (value) {
      propertyUnique(
        props.apiCollectionName,
        "applicationId",
        value,
        props.id
      ).then(result => setIsUnique(!result.data.success));
    }
  }, [value]);

  return <Input {...fieldProps} value={value} />;
}
