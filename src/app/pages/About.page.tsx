import json from '../../../package.json'
import Anchor from '../components/Anchor'

const appName = import.meta.env.VITE_APP_NAME
function AboutPage() {
    window.ipcRenderer.send('win:resize', { width: 800, height: 600 })

    return (
        <>
            <title>{"About - " + appName}</title>
            <header className="flex flex-col items-center">
                <h1 className="title text-5xl">About</h1>
                <h2 className="title text-4xl">{import.meta.env.VITE_APP_NAME} v{json.version}</h2>

                <p className="text-lg text-muted-foreground">
                    {json.description}
                </p>
            </header>
            <div className="card p-10 card-border w-2xl mt-5 glass">
                <div className="card-body items-center text-center">
                    <p>Created based on <Anchor title="Electron Vite" link="https://electron-vite.github.io/" />, use React as a frontend (<Anchor title="read documentation here" link="https://react.dev/reference/react" />), Tailwindcss (<Anchor title="read about Tailwindcss" link="https://tailwindcss.com/docs/" />), and DaisyUI (<Anchor title="learn more" link="https://daisyui.com/docs/intro/" />).
                    </p>
                    <p>This Application contains DB migration for Basic ACL tables. Provides migration and rollback features.</p>
                    <p>View source code on <Anchor link="https://github.com/inoshadi/example-electron-migration" title="Github" /></p>
                </div>
            </div>
        </>
    )
}

export default AboutPage