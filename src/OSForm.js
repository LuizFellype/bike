

import React from 'react';
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { InputMask } from 'primereact/inputmask';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { cleanServicesAndPecas, normalizeCurrency, updateItembyIndex } from './helpers/normalizeOS';
import { withRouter } from 'react-router-dom';
import copy from 'clipboard-copy';
import { useToastContext } from './hooks/ToastContext';
import { UserExtraInfo } from './components/UserExtraInfo';

const initialStates = {
    services: [{ service: 'Revisão geral', value: '150,00' }],
    pecas: [{ peca: 'Corrente', value: '100,00' }]
}
const OSForm = props => {
    const toastRef = useToastContext()
    const [extraInfo, setExtraInfo] = React.useState({})
    const [date, setDate] = React.useState(() => new Date())
    const [phone, setPhone] = React.useState('')
    const [services, setServices] = React.useState(initialStates.services)
    const [pecas, setPecas] = React.useState(initialStates.pecas)
    const nameRef = React.useRef()
    const servicesRef = React.useRef(null)
    const valueRef = React.useRef(null)
    const pecasRef = React.useRef(null)
    const pecasValueRef = React.useRef(null)
    const colorRef = React.useRef(null)
    const hasUpdatedStatefullFieldsRef = React.useRef(false)

    const isUpdating = React.useMemo(() => !!props.selected, [props.selected])

    // pre-populate inputs  
    React.useEffect(() => {
        if (!!props.selected) {
            const {
                name,
                phone: phoneSelected,
                services = [],
                pecas = [],
                color,
                value,
                date
            } = props.selected


            nameRef.current.element.value = name
            setPhone(phoneSelected)
            setServices(services)
            setPecas(pecas)
            colorRef.current.element.value = color
            valueRef.current.inputEl.value = value
            setDate(new Date(date))
            setExtraInfo(props.selected.extraInfo || {})
        }
    }, [props.selected])

    const trackChangeWrapper = (cb) => (params) => {
        if (isUpdating) {
            hasUpdatedStatefullFieldsRef.current = true
        }

        cb(params)
    }

    const servicesTotalAmount = services.reduce((acc, { value }) => {
        return acc + normalizeCurrency(value)
    }, 0)
    const pecasTotalAmount = pecas.reduce((acc, { value }) => {
        return acc + normalizeCurrency(value)
    }, 0)

    const total = pecasTotalAmount + servicesTotalAmount

    const handleForm = (e) => {
        e.preventDefault()
        const formValues = {
            name: nameRef.current.element.value,
            phone: phone,
            services: cleanServicesAndPecas(services, 'service'),
            pecas: cleanServicesAndPecas(pecas, 'peca'),
            color: colorRef.current.element.value,
            value: total,
            date: !!date ? new Date(date).getTime() : new Date().getTime(),
            extraInfo,
        }

        const hasRefsChanged = nameRef.current.element.value !== props.selected.name ||
            colorRef.current.element.value !== props.selected.color
        debugger

        if (isUpdating) {
            if (hasUpdatedStatefullFieldsRef.current || hasRefsChanged) {
                props.onSubmit({ ...props.selected, ...formValues }, props.selected.id)
                hasUpdatedStatefullFieldsRef.current = false
            }
        } else {
            props.onSubmit(formValues)
        }
    }

    const setServiceWrapper = trackChangeWrapper(setServices)
    const setPecasWrapper = trackChangeWrapper(setPecas)

    const handleAddServiceAndPecas = (isPecas) => {
        if (isPecas) {
            setPecasWrapper([
                ...pecas,
                { peca: pecasRef.current.element.value, value: pecasValueRef.current.inputEl.value }
            ])

            pecasRef.current.element.value = ''
            pecasValueRef.current.inputEl.value = ''
        } else {

            setServiceWrapper([
                ...services,
                { service: servicesRef.current.element.value, value: valueRef.current.inputEl.value }
            ])
            servicesRef.current.element.value = ''
            valueRef.current.inputEl.value = ''
        }
    }

    const handleExtraInfoChange = React.useCallback((e) => {
        const { id, value } = e.currentTarget

        trackChangeWrapper(setExtraInfo)({ ...extraInfo, [id]: value })
    }, [extraInfo])

    if (props.viewOnly && !props.selected) return <></>

    const handleCancelToggle = () => {
        nameRef.current.element.value = ''
        setPhone('')
        colorRef.current.element.value = ''
        setServices(initialStates.services)
        setPecas(initialStates.pecas)

        props.onCancel()
    }
    
    return (
        <Card>
            {
                props.selected && <div className='p-d-flex p-jc-end'>
                    <span className="p-tag p-tag-rounded">OS SELECIONADA: <b>{isUpdating && props.selected.osNumber}</b></span>
                </div>
            }
            <form id="react-no-print" onSubmit={handleForm}>
                <div className="p-d-flex p-flex-column">
                    <div className="p-fluid p-formgrid p-grid">
                        <div className="p-field p-col-12 p-md-6">
                            <label htmlFor="firstname6">Nome</label>
                            <InputText disabled={props.viewOnly} id="firstname6" type="text" placeholder="ex.: Luiz Fellype" ref={nameRef} required />
                        </div>
                        <div className="p-field p-col-10 p-md-5">
                            <label htmlFor="phone">Phone</label>
                            <InputMask disabled={props.viewOnly} id="phone" mask="999999999?99" value={phone} onChange={e => setPhone(e.value)} required />
                        </div>

                        <UserExtraInfo values={extraInfo} onChange={handleExtraInfoChange} viewOnly={props.viewOnly} />


                        <div className="p-field p-col-12">
                            <label htmlFor="services">Serviços</label>
                            {
                                services.map(({ service, value }, idx) => {
                                    return <div className='p-d-flex p-mb-1' key={idx}>
                                        <InputTextarea disabled={props.viewOnly} id="services" type="text" rows="2" autoResize placeholder="ex.: Revisão geral, Pedal e Pastilhas." value={service} onChange={(e) => {
                                            const valuesUpdated = updateItembyIndex(idx, services, { service: e.currentTarget.value, value })
                                            setServiceWrapper(valuesUpdated)
                                        }} />

                                        <div className="p-inputgroup p-ml-2 mw-200">
                                            <span className="p-inputgroup-addon">
                                                <span>R$</span>
                                            </span>
                                            <span className="p-float-label">
                                                <InputNumber disabled={props.viewOnly} id="value" mode="decimal" minFractionDigits={2} maxFractionDigits={2} value={normalizeCurrency(value)} onChange={(e) => {
                                                    const value = normalizeCurrency(e.value, true)
                                                    const valuesUpdated = updateItembyIndex(idx, services, { service, value })
                                                    // console.log('value --', `${value}`)
                                                    setServiceWrapper(valuesUpdated)
                                                }} />
                                                <label htmlFor="inputgroup" />
                                            </span>
                                        </div>
                                    </div>
                                })
                            }
                            <div className={`${props.viewOnly ? 'd-p-none' : 'p-d-flex hide-on-print'}`}>
                                <InputTextarea disabled={props.viewOnly} id="services" type="text" rows="2" autoResize ref={servicesRef} />
                                <div className="p-inputgroup p-ml-2 mw-200">
                                    <span className="p-inputgroup-addon">
                                        <span>R$</span>
                                    </span>
                                    <span className="p-float-label">
                                        <InputNumber disabled={props.viewOnly} id="value" mode="decimal" minFractionDigits={2} maxFractionDigits={2} ref={valueRef} />
                                        <label htmlFor="inputgroup" />
                                    </span>
                                </div>
                                <Button onClick={() => handleAddServiceAndPecas()} icon='pi pi-plus' className="p-button-outlined p-button-lg p-button-primary p-ml-2" tooltip='Click para adicionar o serviço.' type='button' tooltipOptions={{ position: 'bottom' }} />
                            </div>
                        </div>

                        <div className="p-field p-col-12">
                            <label htmlFor="pecas">Peças / Acessórios</label>
                            {
                                pecas.map(({ peca, value }, idx) => {
                                    return <div className='p-d-flex p-mb-1' key={idx}>
                                        <InputTextarea disabled={props.viewOnly} id="pecas" type="text" rows="2" autoResize placeholder="ex.: Pedal, Corrente ..." value={peca} onChange={(e) => {
                                            const valuesUpdated = updateItembyIndex(idx, pecas, { peca: e.currentTarget.value, value })

                                            setPecasWrapper(valuesUpdated)
                                        }} />

                                        <div className="p-inputgroup p-ml-2 mw-200">
                                            <span className="p-inputgroup-addon">
                                                <span>R$</span>
                                            </span>
                                            <span className="p-float-label">
                                                <InputNumber disabled={props.viewOnly} id="value" mode="decimal" minFractionDigits={2} maxFractionDigits={2} value={normalizeCurrency(value)} onChange={(e) => {
                                                    const value = normalizeCurrency(e.value, true)
                                                    const valuesUpdated = updateItembyIndex(idx, services, { peca, value })
                                                    setPecasWrapper(valuesUpdated)
                                                }} />
                                                <label htmlFor="inputgroup" />
                                            </span>
                                        </div>
                                    </div>
                                })
                            }
                            <div className={`${props.viewOnly ? 'd-p-none' : 'p-d-flex hide-on-print'}`}>
                                <InputTextarea disabled={props.viewOnly} id="services" type="text" rows="2" autoResize ref={pecasRef} />
                                <div className="p-inputgroup p-ml-2 mw-200">
                                    <span className="p-inputgroup-addon">
                                        <span>R$</span>
                                    </span>
                                    <span className="p-float-label">
                                        <InputNumber disabled={props.viewOnly} id="value" mode="decimal" minFractionDigits={2} maxFractionDigits={2} ref={pecasValueRef} />
                                        <label htmlFor="inputgroup" />
                                    </span>
                                </div>
                                <Button onClick={() => handleAddServiceAndPecas(true)} icon='pi pi-plus' className="p-button-outlined p-button-lg p-button-primary p-ml-2" tooltip='Click para adicionar a peça.' type='button' tooltipOptions={{ position: 'bottom' }} />
                            </div>
                        </div>
                        <div className="p-field p-col-12 p-md-4">
                            <label htmlFor="date">Data</label>
                            <Calendar disabled={props.viewOnly} id="date" showIcon value={date} onChange={e => setDate(e.value)} dateFormat='dd/mm/yy' />
                        </div>
                        <div className="p-field p-col-6 p-md-4">
                            <label htmlFor="color">Marca/Modelo/Cor</label>
                            <InputText disabled={props.viewOnly} id="color" type="text" ref={colorRef} />
                        </div>

                        <div className="p-field p-col-6 p-md-4 p-text-center" style={{ fontSize: '1.25rem' }}>
                            <h3 className='p-mt-1 p-mb-2'>Total</h3>
                            <span>R$ {total}</span>
                        </div>
                    </div>

                    <div className={'p-d-flex p-jc-end hide-on-print'} >
                        {props.selected && <Button label='Compartilhar' onClick={async () => {
                            const sharableUrl = `${window.location.origin}/#/os/${props.selected.osNumber}`
                            try {
                                await navigator.share({
                                    title: `OS: ${props.selected.osNumber} - Velo27`,
                                    text: 'Detalhes de sua Ordem de Serviço na oficina Velo27',
                                    url: sharableUrl
                                })
                            } catch (error) {
                                copy(sharableUrl)
                                toastRef.current.show({
                                    severity: 'success',
                                    summary: 'SUCESSO!',
                                    detail: 'Link compartilhável da OS copiado com sucesso.'
                                })
                            }
                        }} type='button' className="p-button-outlined p-button-primary button-sm" />}

                        <div className={`${props.viewOnly ? 'd-p-none' : 'p-d-flex'}`} >
                            <Button label='Cancelar' onClick={handleCancelToggle} type='button' className="p-button-outlined p-button-secondary p-ml-1 button-sm" />
                            <Button type='submit' label={isUpdating ? 'Atualizar' : 'Salvar'} className="p-button-success p-ml-1 button-sm" />
                        </div>
                    </div >
                </div >
            </form>
        </Card>
    );
}

export default withRouter(OSForm)