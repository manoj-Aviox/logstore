import React, { useState, useEffect } from 'react';
import Keycloak from 'keycloak-js';

const Demo = () => {
    const [keycloak, setKeycloak] = useState(null)
    const [authenticated, setAuthenticated] = useState(false)
    const demo = () => {
        const keycloak = Keycloak({
            "realm": "RealDemo",
            "auth-server-url": "https://iam.sandboxing.tech/",
            "ssl-required": "external",
            "resource": "demo-client",
            "public-client": true,
            "confidential-port": 0,
            "clientId": "demo-client"
        });
        try {
            const authenticated = keycloak.init({ onLoad: 'login-required' })
            setKeycloak(keycloak)
            setAuthenticated(authenticated)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        demo()
    }, [])

    if (keycloak) {
        if (authenticated) return (
            <div className='my-12 grid place-items-center'>
                <p> You are logged in.</p>
                <div>

                    <img src="https://random.imagecdn.app/500/250" />
                </div>
            </div>
        );
        else return (<div className='my-12'>Unable to initiate auth!</div>)
    }
    return (
        <>
            <div className='my-12'>Keycloak initializing in a moment...</div>
        </>
    )
}

export default Demo