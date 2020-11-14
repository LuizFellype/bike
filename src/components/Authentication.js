// https://github.com/lingonsaft/React-FirebaseUi-Authentication/blob/master/src/App.js
import React from "react"
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"
import { withRouter } from "react-router-dom"
import { FB } from "../firebaseConfig"

const uiConfig = {
    signInFlow: "popup",

    signInOptions: [
        FB.auth.GoogleAuthProvider.PROVIDER_ID,
        FB.auth.EmailAuthProvider.PROVIDER_ID
    ],
    callbacks: {
        signInSuccess: () => false
    }
}

const Authentication = (props) => {
    const [isSignedIn, setIsSignedIn] = React.useState(false)

    React.useEffect(() => {
        FB.auth().onAuthStateChanged(user => {
            setIsSignedIn(!!user)
        })
    }, [props])

    return <div className="p-mt-4">
        {isSignedIn ? (
            <>
                <button onClick={() => FB.auth().signOut()}>Deslogar</button>
                {props.children}
            </>
        ) : (
                props.location.pathname.includes('admin') ? <StyledFirebaseAuth
                    uiConfig={uiConfig}
                    firebaseAuth={FB.auth()}
                /> : <div className='p-d-flex p-jc-center'><h1>Voçê não está autenticado.</h1></div>
            )}
    </div>
}

export default withRouter(Authentication)