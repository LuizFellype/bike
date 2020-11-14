import React from 'react'
import { OSPresentation } from '../components/OsPresentation'
import { useToastContext } from '../hooks/ToastContext'

const OsViewOnly = (props) => {
    const toastRef = useToastContext()
    const { os } = props.match.params

    React.useEffect(() => {
        if (!os || !(typeof Number(os) === 'number')) {
            toastRef.current.show({
                severity: 'error',
                summary: 'Numero de OS inválida',
                detail: `OS pesquisada: '${props.location.pathname}' não é válida.`
            })
        } else {
            
        }

    }, [os, props.location.pathname, toastRef])

    return (
        <OSPresentation viewOnly />
    )
}

export default OsViewOnly