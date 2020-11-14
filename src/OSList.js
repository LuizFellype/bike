import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Message } from 'primereact/message';
import React from 'react';
import { withRouter } from "react-router-dom"
// import { Button } from 'primereact/button';
import { getAllByOSOrPhone } from './services/client';
import { useToastContext } from './hooks/ToastContext';
import { CONSTS } from './helpers/constants';

export const OSList = withRouter((props) => {
  const toastRef = useToastContext()

  const [data, setData] = React.useState()
  const searchRef = React.useRef()
  const { os } = props.match.params

  const handleKeyDown = async (e) => {
    if (e.keyCode === 13) {
      const { data: list, type } = await getAllByOSOrPhone(e.customValue || searchRef.current.element.value)
      
      if (list.length && type === CONSTS.GENERAL_KEYS.osByKeys.osNumber) {
        props.onOSSelect(list[0])
      }
      setData(list)
      return type
    }
  }

  React.useEffect(() => {
    const OsIsNotValid = !!os && isNaN(os)

    if (OsIsNotValid) {
      toastRef.current.show({
        severity: 'error',
        summary: 'Numero de OS inválida',
        detail: `OS pesquisada: "${props.location.pathname}" não é válida.`
      })
    } else {
      handleKeyDown({ customValue: os, keyCode: 13 })
    }
    // eslint-disable-next-line
  }, [os, props.location.pathname, toastRef])

  let msgText = 'Digite no campo acima e clique enter para filtrar.'
  if ((searchRef.current && searchRef.current.element.value) || (data && !data.length && !!os)) msgText = 'Nenhum dado encontrado.'
  else if (!data && !!os) msgText = 'Carregando...'

  return (
    <div className='p-d-flex p-flex-column'>

      <div className={`${!!os ? 'p-d-none' : 'p-d-flex p-jc-end p-py-3 p-ai-end'}`}>
        <div className="p-d-flex p-flex-column p-as-end">
          <label htmlFor="search">OS ou Telefone</label>
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText placeholder="Search" id='search' ref={searchRef} tooltip="Digite e aperte enter para filtrar" tooltipOptions={{ position: 'bottom' }} onKeyDown={handleKeyDown} />
          </span>
        </div>

        {/* {props.onPrint && <Button onClick={props.onPrint} label="Print OS para enviar" className="p-button-outlined p-button-primary p-button-rounded p-ml-2" icon="pi pi-copy" />} */}
      </div>
      {
        !!data && data.length ?
          <div className="card">
            {/* <DataTable value={data} selection={selected} onSelectionChange={e => this.setState({ selectedProduct1: e.value })} selectionMode="single"> */}
            <DataTable value={data} onSelectionChange={e => props.onOSSelect(e.value)} selectionMode="single">
              <Column field="osNumber" header="OS"></Column>
              <Column field="name" header="Nome"></Column>
              <Column field="phone" header="Telefone"></Column>
            </DataTable>
          </div> : <Message
            severity="info"
            text={msgText} />
      }

    </div>
  )
})