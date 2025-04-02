// import { Outlet } from 'react-router-dom'
// import Header from './Header'
// import Footer from './Footer'
import { default as BaseLayout } from '../../components/Layout'
const Layout = () => {
    return (
        <BaseLayout header={{ show: false }} outletExtraCLass={"mt-8"} />
    )
}
export default Layout