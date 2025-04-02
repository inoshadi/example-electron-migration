import { useState, useEffect } from 'react'

import { HashRouter, Routes, Route } from "react-router";
import Layout from './components/Layout.tsx'
import { default as AuthLayout } from './auth/components/Layout.tsx'
import AboutPage from './pages/About.page.tsx'
import MainPage from './pages/Main.page.tsx'
import NoPage from './pages/No.page.tsx'
import ManagePage from './pages/Manage.page.tsx'
import AuthConnectingPage from './auth/pages/AuthConnecting.page.tsx'

const appName = import.meta.env.VITE_APP_NAME

function AppRouter() {
    const [connected, setConnected] = useState(false)
    useEffect(() => {
        window.ipcRenderer.on('auth:is-connected', (_event, response) => {
            setConnected(response)
        })
    }, [connected]);
    return (
        <>
            <title>{"Welcome - " + appName}</title>
            <HashRouter>
                <Routes>
                    {connected ?
                        <Route path="/" element={<Layout />}>
                            <Route index element={<MainPage />} />
                            <Route path="about" element={<AboutPage />} />
                            <Route path="manage" element={<ManagePage />} />
                            <Route path="*" element={<NoPage />} />
                        </Route>
                        :
                        <Route path="/" element={<AuthLayout />}>
                            <Route index element={<AuthConnectingPage />} />
                            <Route path="*" element={<AuthConnectingPage />} />
                        </Route>
                    }
                </Routes>
            </HashRouter>
        </>
    )
}

export default AppRouter