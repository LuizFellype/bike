// https://github.com/lingonsaft/React-FirebaseUi-Authentication/blob/master/src/App.js
import { Button } from "primereact/button"
import React from "react"
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"
import { withRouter } from "react-router-dom"
import { FB } from "../firebaseConfig"
import { getUserRoles } from "../services/client"
import logo from "../assets/velo27logo192.jpg"
import { CONSTS } from "../helpers/constants"

const uiConfig = {
    signInFlow: "popup",

    signInOptions: [
        // FB.auth.GoogleAuthProvider.PROVIDER_ID,
        FB.auth.EmailAuthProvider.PROVIDER_ID
    ],
    callbacks: {
        signInSuccessWithAuthResult: () => false
    }
}

const AuthContext = React.createContext({})

const Authentication = (props) => {
    const [isSignedIn, setIsSignedIn] = React.useState(false)
    const [userRoles, setUserRoles] = React.useState({})

    React.useEffect(() => {
        FB.auth().onAuthStateChanged(async user => {
            if (user) {
                const idTokenRes = await user.getIdTokenResult()
                setUserRoles(await getUserRoles(idTokenRes.claims.user_id))
            }
            setIsSignedIn(!!user)
        })
    }, [props])

    const authCtxValue = React.useMemo(() => ({
        isSignedIn,
        ...userRoles
    }), [isSignedIn, userRoles])

    const signOut = () => FB.auth().signOut().catch(() => props.history.push('/'))

    const isAdmin = isSignedIn && userRoles.isAdmin
    const privateNotValid = props.auth === CONSTS.PERMISSIONS.private && !isAdmin
    const showHomeButton = props.location.pathname !== '/' && isAdmin
    return <div className="p-mt-4">
        {isSignedIn ? (privateNotValid ? (
            <div className='p-d-flex p-jc-center'><Button label='Deslogar' tooltip='Você não tem permissão para acessar o conteudo desta pagina, porfavor deslogue e entre com uma conta admin.' onClick={signOut} /></div>
        ) : <div className="demo-container p-mx-2 p-mt-4 p-mx-lg-6">
                <AuthContext.Provider value={authCtxValue}>
                    <div className={`p-d-flex p-jc-between p-ai-${showHomeButton ? 'start' : 'center'} p-mt-4 p-mb-sm-2`}>
                        {!!showHomeButton && <Button onClick={() => props.history.push('/')} icon='pi pi-home' tooltip='Ir para pagina principal' className='p-button-outlined' />}
                        <img src={logo} width='65px' alt="Velo27 logo" />
                        <Button onClick={signOut} icon='pi pi-sign-out' tooltip='Deslogar' className='p-button-outlined' />
                    </div>
                    {props.children}
                </AuthContext.Provider>
            </div>
        ) : (
                <StyledFirebaseAuth
                    uiConfig={uiConfig}
                    firebaseAuth={FB.auth()}
                />
            )}
    </div>
}

export default withRouter(Authentication)

export const useAuthCtx = () => {
    const authCtxValues = React.useContext(AuthContext)

    return authCtxValues
}