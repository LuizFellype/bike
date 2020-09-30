

import React from 'react';
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { InputMask } from 'primereact/inputmask';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

const OSForm = props => {
    const [date, setDate] = React.useState(() => new Date())
    const [phone, setPhone] = React.useState('')
    const nameRef = React.useRef()
    const servicesRef = React.useRef(null)
    const colorRef = React.useRef(null)
    const valueRef = React.useRef(null)

    // pre-populate inputs  
    React.useEffect(() => {
        if (!!props.selected) {
            const {
                name,
                phone: phoneSelected,
                services,
                color,
                value,
                date
            } = props.selected


            nameRef.current.element.value = name
            setPhone(phoneSelected)
            servicesRef.current.element.value = services
            colorRef.current.element.value = color
            valueRef.current.inputEl.value = value
            setDate(new Date(date))
        }
    }, [props.selected])
    
    const isUpdating = !!props.selected
    const handleForm = (e) => {
        e.preventDefault()
        const formValues = {
            name: nameRef.current.element.value,
            phone: phone,
            services: servicesRef.current.element.value,
            color: colorRef.current.element.value,
            value: valueRef.current.inputEl.value,
            date: !!date ? new Date(date).getTime() : new Date().getTime()
        }

        isUpdating ? props.onSubmit(formValues, props.selected.id) : props.onSubmit(formValues)
    }
    return (
        <Card>
            {
                props.selected && <div className='p-d-flex p-jc-end'>
                    <span><b>OS:</b> {isUpdating && props.selected.date}</span>
                </div>
            }
            <form id="react-no-print" onSubmit={handleForm}>
                <div className="p-d-flex p-flex-column">
                    <div className="p-fluid p-formgrid p-grid">
                        <div className="p-field p-col-12 p-md-6">
                            <label htmlFor="firstname6">Nome</label>
                            <InputText id="firstname6" type="text" placeholder="ex.: Luiz Fellype" ref={nameRef} required />
                        </div>
                        <div className="p-field p-col-12 p-md-6">
                            <label htmlFor="phone">Phone</label>
                            <InputMask id="phone" mask="99999-9999" placeholder="99999-9999" value={phone} onChange={e => setPhone(e.value)} required />
                        </div>
                        <div className="p-field p-col-12">
                            <label htmlFor="services">Peças / Acessórios / Serviços</label>
                            <InputTextarea id="services" type="text" rows="4" placeholder="ex.: Revisão geral, Pedal e Pastilhas." ref={servicesRef} />
                        </div>
                        <div className="p-field p-col-12 p-md-4">
                            <label htmlFor="date">Data</label>
                            <Calendar id="date" showIcon value={date} onChange={e => setDate(e.value)} dateFormat='dd/mm/yy' />
                        </div>
                        <div className="p-field p-col-6 p-md-4">
                            <label htmlFor="color">Cor predominante</label>
                            <InputText id="color" type="text" ref={colorRef} />
                        </div>
                        <div className="p-field p-col-6 p-md-4">
                            <label htmlFor="value">Valor</label>
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">
                                    <span>R$</span>
                                </span>
                                <span className="p-float-label">
                                    <InputNumber id="value" mode="decimal" minFractionDigits={2} maxFractionDigits={2} ref={valueRef} />
                                    <label htmlFor="inputgroup" />
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className='p-d-flex p-d-flex p-jc-end'>
                        <Button label='Cancelar' onClick={props.onCancel} className="p-button-outlined p-button-secondary" />
                        <Button type='submit' label={isUpdating ? 'Atualizar' : 'Salvar'} className="p-button-success p-ml-2" />
                    </div >
                </div >
            </form>
        </Card>
    );
}

export default OSForm