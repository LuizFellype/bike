import { Toast } from 'primereact/toast';
import React from 'react';
const ToastContext = React.createContext({})

export const ToastContextProvider = (props) => {
    const toastRef = React.useRef()
    return (
        <>
            <Toast ref={toastRef} />
            <ToastContext.Provider value={toastRef}>
                {props.children}
            </ToastContext.Provider>
        </>
    )
}

export const useToastContext = () => {
    return React.useContext(ToastContext)
}