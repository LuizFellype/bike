import React from 'react';
import { printComponent } from "react-print-tool"
import OSForm from './OSForm';
import { createOS, updateOSById, getOsLastNumber, setOsLastNumber } from './services/client';
import { Toast } from 'primereact/toast';

import './App.css';
import { OSList } from './OSList';
import { CONSTS } from './helpers/constants';
import { getCookie, setCookie } from './helpers/cookies';
const { STORAGE } = CONSTS
const ComponentToBePrinted = (props) => {
  return <div>
    <h1 className="p-text-center">Bicicletaria</h1>
    <p className="p-text-center">Condomínio do Centro Comercial Long Beach - Av. Hugo Viola, 955 - Loja 8 - Mata da Praia, Vitória - ES, 29065-475 - Telefone: (27) 3024-6755</p>
    <OSForm {...props} />
  </div>
}

function App() {
  const [selected, setSelected] = React.useState()
  const [lastOsNumber, setLastOsNumber] = React.useState()
  const toastRef = React.useRef()

  const print = () => printComponent(<ComponentToBePrinted selected={selected} onSubmit={handleSubmit} onCancel={() => setSelected(undefined)} onPrint={print} />)

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
        <ComponentToBePrinted selected={selected} onSubmit={handleSubmit} onCancel={() => setSelected(undefined)} onPrint={print} />

        <OSList onOSSelect={setSelected} onPrint={selected && print} />
      </div>
    </>
  );
}

export default App;
