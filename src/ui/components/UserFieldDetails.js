import React from 'react'
import { getCommonUser } from '../../Service/CommonUserService';
import { useState } from 'react';

export default function UserFieldDetails({ register, methods, errors, ...props }) {
    const [additionalUserInformation, setAdditionalUserInformation] = useState();

    if(methods){
        let user = methods.getValues(props.name);
        if(user && user[0] && user[0].refDoc && (!additionalUserInformation || additionalUserInformation._id.$oid !== user[0].refDoc.$oid)){
          getCommonUser(`${user[0].refDoc.$oid}`).then(response => { setAdditionalUserInformation(response.data)});
        }
        
      }
  return (
    additionalUserInformation && 
        <div style={{width: "100%", display: "flex",justifyContent: "space-between"}}>
          <div><b>Name:</b>{additionalUserInformation.firstName} {additionalUserInformation.lastName}</div>
          <div><b>Email:</b>{additionalUserInformation.email}</div>
          <div><b>Company:</b>{additionalUserInformation.company ? additionalUserInformation.company.map(ele => ele.name).join("/"): ""}</div>
          <div><b>Route:</b>{additionalUserInformation.route ? additionalUserInformation.route.map(ele => ele.name).join("/"): ""}</div>
          <div><b>DU:</b>{additionalUserInformation.deliveryUnit}</div>
          <div><b>Discipline:</b>{additionalUserInformation.discipline ? additionalUserInformation.discipline.map(ele => ele.name).join("/"): ""}</div>
        </div>
  )
}
