

import React from 'react';
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { InputMask } from 'primereact/inputmask';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { normalizeCurrency, updateItembyIndex } from './helpers/normalizeOS';

const OSForm = props => {
    const [date, setDate] = React.useState(() => new Date())
    const [phone, setPhone] = React.useState('')
    const [services, setServices] = React.useState([{ service: 'Revisão geral', value: '130,00' }])
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
            setServices(services)
            colorRef.current.element.value = color
            valueRef.current.inputEl.value = value
            setDate(new Date(date))
        }
    }, [props.selected])

    const isUpdating = !!props.selected
    const servicesTotalAmount = services.reduce((acc, { value }) => {
        return acc + normalizeCurrency(value)
    }, 0)

    const handleForm = (e) => {
        e.preventDefault()
        const formValues = {
            name: nameRef.current.element.value,
            phone: phone,
            services: services,
            color: colorRef.current.element.value,
            value: valueRef.current.inputEl.value,
            date: !!date ? new Date(date).getTime() : new Date().getTime()
        }
        
        isUpdating ? props.onSubmit({...props.selected, ...formValues}, props.selected.id) : props.onSubmit(formValues)
    }

    const handleAddService = () => {
        setServices([
            ...services,
            { service: servicesRef.current.element.value, value: valueRef.current.inputEl.value }
        ])
        servicesRef.current.element.value = ''
        valueRef.current.inputEl.value = ''
    }


    return (
        <Card>
            {
                props.selected && <div className='p-d-flex p-jc-end'>
                    <span><b>OS:</b> {isUpdating && props.selected.osNumber}</span>
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
                            {
                                services.map(({ service, value }, idx) => {
                                    return <div className='p-d-flex p-mb-1' key={idx}>
                                        <InputTextarea id="services" type="text" rows="2" placeholder="ex.: Revisão geral, Pedal e Pastilhas." value={service} onChange={(e) => {
                                            const valuesUpdated = updateItembyIndex(idx, services, { service: e.currentTarget.value, value })
                                            console.log({idx, valuesUpdated, e})
                                            setServices(valuesUpdated)
                                        }} />

                                        <div className="p-inputgroup p-ml-2 mw-200">
                                            <span className="p-inputgroup-addon">
                                                <span>R$</span>
                                            </span>
                                            <span className="p-float-label">
                                                <InputNumber id="value" mode="decimal" minFractionDigits={2} maxFractionDigits={2} value={normalizeCurrency(value)} onChange={(e) => {
                                                    const value = normalizeCurrency(e.value, true)
                                                    const valuesUpdated = updateItembyIndex(idx, services, { service, value })
                                                    console.log('value --', `${value}`)
                                                    setServices(valuesUpdated)
                                                }} />
                                                <label htmlFor="inputgroup" />
                                            </span>
                                        </div>
                                    </div>
                                })
                            }
                            <div className="p-d-flex hide-on-print">
                                <InputTextarea id="services" type="text" rows="2" placeholder="ex.: Revisão geral, Pedal e Pastilhas." ref={servicesRef} />
                                <div className="p-inputgroup p-ml-2 mw-200">
                                    <span className="p-inputgroup-addon">
                                        <span>R$</span>
                                    </span>
                                    <span className="p-float-label">
                                        <InputNumber id="value" mode="decimal" minFractionDigits={2} maxFractionDigits={2} ref={valueRef} />
                                        <label htmlFor="inputgroup" />
                                    </span>
                                </div>
                                <Button onClick={handleAddService} icon='pi pi-plus' className="p-button-outlined p-button-lg p-button-primary p-ml-2" tooltip='Click para adicionar o serviço.' type='button' tooltipOptions={{ position: 'bottom' }} />
                            </div>
                        </div>
                        <div className="p-field p-col-12 p-md-4">
                            <label htmlFor="date">Data</label>
                            <Calendar id="date" showIcon value={date} onChange={e => setDate(e.value)} dateFormat='dd/mm/yy' />
                        </div>
                        <div className="p-field p-col-6 p-md-4">
                            <label htmlFor="color">Cor predominante</label>
                            <InputText id="color" type="text" ref={colorRef} />
                        </div>

                        <div className="p-field p-col-6 p-md-4 p-text-center" style={{ fontSize: '1.25rem' }}>
                            <h3 className='p-mt-1 p-mb-2'>Total</h3>
                            <span>R$ {servicesTotalAmount}</span>
                        </div>
                    </div>
                    <div className='p-d-flex p-d-flex p-jc-end hide-on-print'>
                        <Button label='Cancelar' onClick={props.onCancel} type='button' className="p-button-outlined p-button-secondary hide-on-print" />
                        <Button type='submit' label={isUpdating ? 'Atualizar' : 'Salvar'} className="p-button-success p-ml-2 hide-on-print" />
                    </div >
                </div >
            </form>
        </Card>
    );
}

export default OSForm