import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Message } from 'primereact/message';
import React from 'react';
import { getAllByOSOrPhone } from './services/client';

export const OSList = (props) => {
  const [data, setData] = React.useState()
  const searchRef = React.useRef()

  const handleKeyDown = async (e) => {
    if (e.keyCode === 13) {
      const list = await getAllByOSOrPhone(searchRef.current.element.value)
      setData(list)
    }
  }

  return (
    <div className='p-d-flex p-pt-4 p-flex-column'>
      <div className="p-d-flex p-flex-column p-as-end p-pb-4">
        <label htmlFor="search">OS ou Telefone</label>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText placeholder="Search" id='search' ref={searchRef} tooltip="Digite e aperte enter para filtrar" tooltipOptions={{position: 'bottom'}} onKeyDown={handleKeyDown} />
        </span>
      </div>

      {
        !!data ?
          <div className="card">
            {/* <DataTable value={data} selection={selected} onSelectionChange={e => this.setState({ selectedProduct1: e.value })} selectionMode="single"> */}
            <DataTable value={data} onSelectionChange={e => props.onOSSelect(e.value)} selectionMode="single">
              <Column field="date" header="OS"></Column>
              <Column field="name" header="Nome"></Column>
              <Column field="phone" header="Telefone"></Column>
            </DataTable>
          </div> : <Message severity="info" text={searchRef.current && searchRef.current.element.value ? 'Nenhum dado encontrado.' : 'Digite no campo acima e clique enter para filtrar.'} />
      }

    </div>
  )
}