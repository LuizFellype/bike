import React from 'react';
import { printComponent } from "react-print-tool"
import OSForm from './OSForm';
import { createOS } from './services/client';
import { Button } from 'primereact/button';
import './App.css';
import { OSList } from './OSList';

function App() {
  const [selected, setSelected] = React.useState()

  const print = () => printComponent(<OSForm selected={selected} />)
  
  const handleSubmit = async (data) => {
    await createOS(data)
  }

  return (
    <div className="demo-container p-mx-2 p-mt-4 p-m-sm-5 p-mx-lg-6 ">
      <OSForm selected={selected} onSubmit={handleSubmit} onCancel={() => setSelected(undefined)} onPrint={print} />

      {selected && <Button onClick={print} label="Print OS para enviar" className="p-button-outlined p-button-secondary" />}

      <OSList onOSSelect={setSelected} />
    </div>
  );
}

export default App;
