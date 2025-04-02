
const MainPage = () => {
    window.ipcRenderer.send('win:resize', { width: 800, height: 600 })
    return (
        <>
            <header className="flex flex-col items-center">
                <h2 className="title text-4xl">Welcome</h2>
                <h1 className="title text-5xl">{import.meta.env.VITE_APP_NAME}</h1>

            </header>
            <div className='items-center justify-center flex flex-col gap-6 mt-5 '>
                <div className="flex w-52 flex-col gap-4">
                    <div className="skeleton h-32 w-full"></div>
                    <div className="skeleton h-4 w-28"></div>
                    <div className="skeleton h-4 w-full"></div>
                    <div className="skeleton h-4 w-full"></div>
                </div>
            </div>
        </>
    )
}
export default MainPage