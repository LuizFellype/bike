import React from 'react';
// import { printComponent } from "react-print-tool"
// import OSForm from '../OSForm';
import { createOS, updateOSById, getOsLastNumber, setOsLastNumber } from '../services/client';
import { Toast } from 'primereact/toast';

import { OSList } from '../OSList';
import { OSPresentation } from '../components/OsPresentation';
// import { OSPresentation } from '../components/OsPresentation';
// import { CONSTS } from './helpers/constants';
// import { getCookie, setCookie } from './helpers/cookies';
// const { STORAGE } = CONSTS

function OsPage(props) {
    const [selected, setSelected] = React.useState()
    const [lastOsNumber, setLastOsNumber] = React.useState()
    const toastRef = React.useRef()

    const { os } = props.match.params

    // const print = () => printComponent(<OSPresentation selected={selected} onSubmit={handleSubmit} onCancel={() => setSelected(undefined)} onPrint={print} />)

    const handleSubmit = async (data, osId) => {
        let item = {}

        try {
            if (!!osId) {
                item = await updateOSById(data, osId)
            } else {
                const nextNumber = lastOsNumber + 1
                item = await createOS({ ...data, osNumber: nextNumber })
                setOsLastNumber(nextNumber)
            }
            toastRef.current.show({ severity: 'success', summary: 'Sucesso !!!', detail: `OS ${item.osNumber} criada/atualizada com sucesso.` })
            setSelected(item)
        } catch (err) {
            console.log('ERROR: ', err)
            toastRef.current.show({
                severity: 'error',
                summary: 'Error ao salvar !!',
                detail: 'Não foi possivel no momento, tente novamente mais tarde ou contate o suporte.'
            })
        }
    }

    React.useEffect(() => {
        const checkForLastOsNumber = async () => {
            try {
                const lastNumber = await getOsLastNumber()
                setLastOsNumber(Number(lastNumber))
            } catch (err) {
                console.log('ERROR: ', err)
                toastRef.current.show({
                    severity: 'error',
                    summary: 'Error ineserapdo !!',
                    detail: 'Não foi possivel identificar qual o proximo número de OS por favor recarregue a pagina ou contate o suporte.'
                })
            }
        }

        checkForLastOsNumber()
    }, [])

    return (
        <>
            <Toast ref={toastRef} />
            <div className="demo-container p-mx-2 p-mt-4 p-m-sm-5 p-mx-lg-6 ">
                <OSPresentation selected={selected} onSubmit={handleSubmit} onCancel={() => setSelected(undefined)} viewOnly={!!os} />

                {!!os && <div className="p-mt-2"></div>}

                <OSList
                    onOSSelect={setSelected}
                // onPrint={selected && print} 
                />
            </div>
        </>
    );
}

export default OsPage;
