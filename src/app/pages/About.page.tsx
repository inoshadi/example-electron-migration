import json from '../../../package.json'
const appName = import.meta.env.VITE_APP_NAME
function AboutPage() {
    window.ipcRenderer.send('win:resize', { width: 800, height: 600 })
    return (
        <>
            <title>{"About - " + appName}</title>
            <header className="flex flex-col items-center">
                <h1 className="title text-5xl">About</h1>
                <h2 className="title text-4xl">{import.meta.env.VITE_APP_NAME}</h2>

                <p className="text-lg text-muted-foreground">
                    {json.description}
                </p>

                <h2 className="title text-4xl mt-2">v{json.version}</h2>
            </header>
            <div className='items-center justify-center flex flex-col gap-6 mt-5'>
                <div className="flex w-52 flex-col gap-4">
                    <div className="skeleton h-32 w-full"></div>
                    <div className="skeleton h-4 w-full"></div>
                    <div className="skeleton h-4 w-32"></div>
                    <div className="skeleton h-4 w-28"></div>
                </div>
            </div>
        </>
    )
}

export default AboutPage