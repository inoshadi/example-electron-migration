import { Outlet } from 'react-router'
import Header from './Header'
import Footer from './Footer'
const Layout = ({ header = { show: true }, footer = { show: false }, outletExtraCLass = "" }) => {
    return (
        <main className="flex flex-col items-center gap-5 mt-1">
            {header.show && <Header />}
            <section className={outletExtraCLass}>
                <Outlet />
            </section>
            {footer.show && <Footer />}
        </main>
    )
}
export default Layout