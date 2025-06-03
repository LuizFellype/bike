import React, { useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { DateTime } from 'luxon';
import './index.css'
import { getOSFromDate } from '../../services/client';
import { formatServicesAndPecasToReport } from '../../helpers/normalizeOS';
import { SelectButton } from 'primereact/selectbutton';

const filterOptionsValues = {
    Semanal: 'Semanal',
    Mensal: 'Mensal'
}
const filterOptions = [
    { label: filterOptionsValues.Semanal, value: filterOptionsValues.Semanal },
    { label: filterOptionsValues.Mensal, value: filterOptionsValues.Mensal },
];

const getLastSunday = () => {
    const dateNow = new Date()

    var today = DateTime.local(dateNow.getFullYear(), dateNow.getMonth() + 1, dateNow.getDate())

    const dayIntheWeek = dateNow.getDay()
    const lastSunday = today.plus({ days: -dayIntheWeek }).ts

    return lastSunday
}
const getFirstDayOfTheMonth = () => {
    var dt = DateTime.local()
    const firstDay = `${dt.year}-${dt.month}-01`
    const firstDayTM = new Date(firstDay)

    return firstDayTM
}

const getDateFromTM = (TMDate = new Date().getTime()) => {
    const date = new Date(TMDate)
    var dt = {
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
    }
    const dateFormated = `${dt.day}/${dt.month < 10 ? '0' : ''}${dt.month}/${dt.year}`

    return dateFormated
}

const AdminPage = () => {
    const [loading, setLoading] = React.useState(true)
    const [rawData, setRawData] = React.useState()
    const [totals, setTotals] = React.useState()
    const [dateFilter, setDateFilter] = React.useState()
    const [filter, setFilter] = React.useState(filterOptionsValues.Mensal)

    const getAllOSFromLastDate = (date) => {
        !loading && setLoading(true)
        
        getOSFromDate(date).then((data = []) => {
            const { services, pecas } = data.reduce((acc, item) => {
                const pecasToSpreed = item.pecas || []
                return {
                    services: [...acc.services, ...item.services],
                    pecas: [...acc.pecas, ...pecasToSpreed]
                }
            }, { services: [], pecas: [] })

            const allTotals = formatServicesAndPecasToReport(services, pecas)

            const rawDataWithTotals = data.reduce((acc, item) => {
                const { services, pecas } = item
                const {
                    services: servicesTotal,
                    pecas: pecasTotal,
                    total
                } = formatServicesAndPecasToReport(services, pecas)

                return [
                    ...acc,
                    {
                        ...item,
                        totalServices: servicesTotal,
                        totalPecas: pecasTotal,
                        total,
                    }
                ]
            }, [])

            setRawData(rawDataWithTotals)
            setTotals(allTotals)
            setDateFilter(date)

            setLoading(false)
        }).catch(e => console.error('>>>>>> ERROR', e))
    }


    useEffect(() => {
        if (filter === filterOptionsValues.Semanal) {
            getAllOSFromLastDate(getLastSunday())
        } else {
            getAllOSFromLastDate(getFirstDayOfTheMonth())
        }

        // eslint-disable-next-line
    }, [filter])


    const footer = totals ? <div className='p-d-flex p-jc-around p-ai-center p-text-center'>
        <span className='badge green'>Services: R$ {totals.services}</span>
        <span className='badge yellow'>+</span>
        <span className='badge green'>Peças: R$ {totals.pecas}</span>
        <span className='badge green'>Total: R$ {totals.total}</span>
    </div> : <></>

    const Title = <div className='p-d-flex p-jc-between p-ai-center p-px-3'>
        <h2>Relatório{dateFilter ? `: ${getDateFromTM(dateFilter)} - ${getDateFromTM()}` : ''}</h2>
        <SelectButton value={filter} options={filterOptions} onChange={(e) => setFilter(e.value)} />
    </div>

    const [expandedRows, setExpandedRows] = React.useState()
    const rowExpansionTemplate = (data) => {
        const servicesAndPecas = [...data.services, ...data.pecas]

        return (
            <div className="p-3">
                <DataTable
                    header={`${data.name} - ${data.phone} - ${getDateFromTM(data.date)}`}
                    value={servicesAndPecas}
                    emptyMessage='Nenhuma OS encontrada essa semana.'
                    className='datatable-responsive-demo'
                >
                    <Column field="service" header="Services" ></Column>
                    <Column field="value" header="Valor" ></Column>
                    <Column field="peca" header="Peças" ></Column>
                </DataTable>

            </div>
        );
    };

    return (
        <Card header={Title} footer={footer} >
            <DataTable
                emptyMessage='Nenhuma OS encontrada essa semana.'
                className='datatable-responsive-demo'
                value={rawData} loading={!rawData || loading}
                expandedRows={expandedRows} onRowToggle={(e) => {
                    setExpandedRows(e.data)
                }}
                rowExpansionTemplate={rowExpansionTemplate}
            >
                <Column expander style={{ width: '2rem' }} />

                <Column field="osNumber" header="OS #" ></Column>
                <Column field="totalServices" header="Services" ></Column>
                <Column field="totalPecas" header="Peças" ></Column>
                <Column field="value" header="Valor" ></Column>
            </DataTable>
        </Card >
    );
}
export default AdminPage