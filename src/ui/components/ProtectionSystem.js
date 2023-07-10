import _uniqueId from 'lodash/uniqueId';
import React, { useEffect, useState } from 'react';
import { changeValueByPath } from '../../Helpers/utils';
import { getAdditionalProtectionSystem } from '../../Service/ProtectionSystemService';
import Input from '../base/InputRhf';
import SingleOption from './SingleOption';

export default function ProtectionSystem({ register, methods, errors, index, ...props }) {
    const [id] = useState(_uniqueId());
    // const [vals, setVals] = useState([])
    const [options, setOptions] = useState([])
    // const [values, setValues] = props.values ? [props.values, props.setValues] : [vals, setVals];
    
    
    let classProps = ['blocked-lines__column-display', 'blocked-lines__section'];
    if (props.disabled) { classProps.push('blocked-lines__wrap--disabled') }
    if (props.className) { classProps.push(props.className) }
    if (props.error) { classProps.push('blocked-lines__wrap--error') }
    if (props.noLabel) { classProps.push('blocked-lines__wrap--no-label') }
    if (props.noMargin) { classProps.push('blocked-lines__wrap--no-margin') }

    useEffect(() => {
        getAdditionalProtectionSystem().then(({ data }) => {
            setOptions(data)
        })
    }, [])

    const fieldProps = {
        id,
        className: "blocked-lines__input blocked-lines__protection-system-form",
        label: "Protection System",
        helpText: "Select the Protection System.",
        required: props.required,
        disabled: props.disabled,
        noLabel: props.noLabel,
        noMargin: props.noMargin,
        autoCompleteLimit: 6,
        fetchFields: ["protectionAndWarningSystems.protectionSystem"],
        isMulti: false,
        queryFields: ["protectionAndWarningSystems.protectionSystem"],
        refDocCollection: "network-gbr-signalPanel",
        fieldsToShow: ["protectionAndWarningSystems.protectionSystem"],
        register: register,
        methods: methods,
        errors: errors,
        unregister: methods.unregister,
    }
    
    const inputProps = {
        id,
        label: "Reason for no protection",
        helpText: "Select the Protection System.",
        fullWidth: true,
        required: true,
        fetchFields: ["protectionAndWarningSystems.protectionSystem"],
        isMulti: false,
        queryFields: ["protectionAndWarningSystems.protectionSystem"],
        refDocCollection: "network-gbr-signalPanel",
        fieldsToShow: ["protectionAndWarningSystems.protectionSystem"],
        disabled: props.disabled,
        noLabel: props.noLabel,
        noMargin: props.noMargin,
        register: register,
        methods: methods,
        errors: errors,
        unregister: methods.unregister,
    }

    const onSelectChange = (items) => {
        const values = items.map(item => item.value)
        const val = options.filter(option => values.includes(option.protectionAndWarningSystems.protectionSystem))

        let extractedFieldsForUpdate = val.map(ele => {
            return ({
                "additionalProtection": ele.additionalProtectionType,
                "refDoc": ele._id,
                "refDocVersion": ele._version,
                "protectionSystem": ele.protectionAndWarningSystems.protectionSystem,
                "protectionSystemIndex": ele.protectionAndWarningSystems.protectionViewOrder,
                "reasonForNoProtection": ''
            })
        })

        if (props.setData && methods) {
            let copy = global.structuredClone(methods.getValues());
            changeValueByPath(copy, `${props.name}.lines.${index}.protectionSystem`, extractedFieldsForUpdate);
            if (props.additionalNameToChange) {
                changeValueByPath(copy, props.additionalNameToChange, extractedFieldsForUpdate);
            }
            if (props.unsetOnChange) {
                props.unsetOnChange.forEach(name => {
                    if (name) {
                        changeValueByPath(copy, name, "");
                    }

                });
            }
            props.setData(copy);
        }

        // setValues(extractedFieldsForUpdate)
    }
    
    const defaultFormValues = fieldProps.methods.getValues(`linesAtSite.lines.${index}.protectionSystem`) || []

    const additionalProtectionTypes = [...new Set(defaultFormValues.map(value => value.additionalProtection))]
    
    const indexOfLineBlockageSimple = defaultFormValues.findIndex(value => value.protectionSystem === 'Line Blockage (simple)')
    
    const onInputChange = (event) => {
        let copy = global.structuredClone(methods.getValues());

        changeValueByPath(copy, `${props.name}.lines.${index}.protectionSystem.${indexOfLineBlockageSimple}.reasonForNoProtection`, event.target.value);
        props.setData(copy);
    }

    const defaultValues = (defaultFormValues && defaultFormValues.map(value => value.protectionSystem)) || [];    

    return (
        <div className={classProps.join(' ')}>
            <h5 className="blocked-lines__section__header">Protection System</h5>
            <SingleOption
                name={`${props.name}.lines.${index}.protectionSystem`}
                displayType="dropdown"
                fullWidth
                {...fieldProps}
                options={options.map(option => ({
                    label: option.protectionAndWarningSystems.protectionSystem, value: option.protectionAndWarningSystems.protectionSystem,
                }))}
                isMulti
                setData={props.setData}
                onChange={onSelectChange}
                value={defaultValues.map(value => ({ label: value, value }))}
            />
            <div className="blocked-lines__input">
                {indexOfLineBlockageSimple !== -1
                    ? <Input
                        name={`${props.name}.lines.${index}.protectionSystem.${indexOfLineBlockageSimple}.reasonForNoProtection`}
                        numRows={4}
                        setData={props.setData}
                        onChange={onInputChange}
                        {...inputProps}
                    />
                    :
                    null}
            </div>
            <div className="blocked-lines__input blocked-lines__protection-system-form">
                {additionalProtectionTypes.length ? <div><div>Additional Protection Type: </div>
                    {additionalProtectionTypes.map(type =>
                        <div key={type}>{type}</div>
                    )}
                </div> : ''}
            </div>
        </div>
    )
}