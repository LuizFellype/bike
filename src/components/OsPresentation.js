import React from 'react';
import OSForm from '../OSForm';

export const OSPresentation = (props) => {
    return <div>
        <h1 className="p-text-center">Velo 27</h1>
        <p className="p-text-center">Condomínio do Centro Comercial Long Beach - Av. Hugo Viola, 955 - Loja 8 - Mata da Praia, Vitória - ES, 29065-475 - Telefone: (27) 3024-6755</p>
        <OSForm {...props} />
    </div>
}