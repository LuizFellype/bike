import React from 'react';
import { printComponent } from "react-print-tool"
import OSForm from './OSForm';
import { createOS } from './services/client';

import './App.css';
import { OSList } from './OSList';

const ComponentToBePrinted = (props) => {
  return <div>
    <h1 className="p-text-center">Bicicletaria</h1>
    <OSForm {...props} />
  </div>
}

function App() {
  const [selected, setSelected] = React.useState()

  const print = () => printComponent(ComponentToBePrinted)

  const handleSubmit = async (data) => {
    const itemAdded = await createOS(data)
    setSelected(itemAdded)
  }

  return (
    <div className="demo-container p-mx-2 p-mt-4 p-m-sm-5 p-mx-lg-6 ">
      <ComponentToBePrinted selected={selected} onSubmit={handleSubmit} onCancel={() => setSelected(undefined)} onPrint={print} />

      <OSList onOSSelect={setSelected} onPrint={selected && print} />
    </div>
  );
}

export default App;
