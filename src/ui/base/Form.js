import React, { useEffect } from 'react'
import { useForm } from "react-hook-form"

export default function Form({ defaultValues, children, onSubmit, ...props }) {
  const { getValues, setValue } = useForm();
  const methods = useForm({ 
    defaultValues,
    mode: "onChange",
    reValidateMode: "onChange"
  });
  console.log("defaultValues", defaultValues)
  const { formState: { errors }, handleSubmit, reset } = methods;
  useEffect(() => {
    reset({ ...defaultValues });
  }, [defaultValues]);
  let classProps = ['form'];
  if (props.disabled) {classProps.push('form--disabled')}
  if (props.border) {classProps.push('form--border')}
  if (props.square) {classProps.push('form--border--square')}
  if (props.columns) {classProps.push('form--columns form--columns'+props.columns)}
  if (props.className) {classProps.push(props.className)}
  
  /**
   * @method
   * For adding manually set data with `setValue`
   */
  const modifySubmitData = (data, target) => {
    const values = getValues()
    let error = methods.getFieldState();
    let isValid = methods.formState.isValid
    console.log('error', error)
    console.log('isValid', isValid)
    if(isValid)
    onSubmit({ ...data, ...values }, target)
  }

  return (
    <div className="form__wrap">
      <form className={classProps.join(' ')} onSubmit={handleSubmit(modifySubmitData)} noValidate>
        <div className="form__header">
          <h3 className="form__title">{props.title}</h3>
          <p className="form__description">{props.description}</p>
        </div>
        <div className="form__body">
          {React.Children.map(children, child => {
            //console.log(child.props.type);
            return child.props.name
              ? React.createElement(child.type, {
                  ...{
                    ...child.props,
                    register: methods.register,
                    unregister: methods.unregister,
                    control: methods.control,
                    methods: methods,
                    setValue: setValue,
                    key: child.props.name,
                    error: errors[child.props.name],
                    valueAsNumber: (child.props.type === "number")? true : false,
                    //valueAsDate: (props.type === "datetime-local")? true : false,
                  }
                })
              : child;
          })}
        </div>
        <div className="form__footer">
          {props.footer}
        </div>
      </form>
    </div>
  );
}