import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

import React from 'react';
const IDS = {
    email: 'email',
    cep: 'cep',
}
export const UserExtraInfo = (props) => {
    const [isOn, setIsOn] = React.useState(props.viewOnly)
    
    const getValueById = React.useCallback((idKey) => props.values[idKey] || '', [props.values])

    return <>
        <div className="p-field p-col-2 p-md-1 p-d-flex p-jc-center p-ai-end">
            <Button type='button' onClick={() => setIsOn(!isOn)} tooltip={isOn ? 'Mostrar email e cep' : 'Esconder email e cep'} icon={`pi ${isOn ? 'pi-eye-slash' : 'pi-eye'}`}  tooltipOptions={{position: 'bottom'}} className="p-button-rounded p-button-outlined" />
        </div>
        
        {
            isOn && <>
            <div className="p-field p-col-12 p-md-6 fade-in">
                <label htmlFor={IDS.email}>Email</label>
                <InputText value={getValueById(IDS.email)} onChange={props.onChange} disabled={props.viewOnly} id={IDS.email} type="text" placeholder="ex: velo27@gmail.com" />
            </div>
            <div className="p-field p-col-12 p-md-6 fade-in">
                <label htmlFor={IDS.cep}>CEP</label>
                <InputText value={getValueById(IDS.cep)} onChange={props.onChange} disabled={props.viewOnly} id={IDS.cep} type="text" />
            </div>
            </>
        }
    </>
}