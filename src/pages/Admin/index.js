import React, { useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { DateTime } from 'luxon';
import './index.css'
import { getOSFromDate } from '../../services/client';
import { formatServicesAndPecasToReport } from '../../helpers/normalizeOS';

const AdminPage = () => {
    const [data, setData] = React.useState()
    const [totals, setTotals] = React.useState()

    useEffect(() => {
        const dateNow = new Date()

        var today = DateTime.local(dateNow.getFullYear(), dateNow.getMonth() + 1, dateNow.getDate())

        const dayIntheWeek = dateNow.getDay()
        const lastSunday = today.plus({ days: -dayIntheWeek }).ts

        getOSFromDate(lastSunday).then(data => {
            const { services, pecas } = data.reduce((acc, item) => {
                return { services: [...acc.services, ...item.services], pecas: [...acc.pecas, ...item.pecas] }
            }, { services: [], pecas: [] })

            const { data: allTogether, ...allTotals } = formatServicesAndPecasToReport(services, pecas)

            setData(allTogether)
            setTotals(allTotals)
        }).catch(console.error)
    }, [])

    const footer = totals ? <div className='p-d-flex p-jc-around p-ai-center p-text-center'>
        <span className='badge green'>Services: R$ {totals.services}</span>
        <span className='badge yellow'>+</span>
        <span className='badge green'>Peças: R$ {totals.pecas}</span>
        <span className='badge green'>Total: R$ {totals.total}</span>
    </div> : <></>
    return (
        <Card title='Relatório' footer={footer}>
            <DataTable value={data} loading={!data} emptyMessage='Nenhuma OS encontrada essa semana.' className='datatable-responsive-demo'>
                <Column field="service" header="Services" ></Column>
                <Column field="value" header="Valor" ></Column>
                <Column field="peca" header="Peças" ></Column>
                <Column field="pecaValue" header="Valor" ></Column>
            </DataTable>
        </Card>
    );
}
export default AdminPage