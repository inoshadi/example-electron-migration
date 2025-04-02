import { useState, useEffect } from 'react'

const ShowCreateDialog = ({ onCloseMe, args = {} }: any) => {
    const [content, setContent] = useState<string>("")

    const getTableCreate = async () => {
        const response = await window.ipcRenderer.invoke('manage:get-tablecreate', args.tablename)
        setContent(response)
    }


    useEffect(() => {
        getTableCreate()
    }, [])

    return (
        <>
            <dialog className="modal" open>
                <div className="modal-box bg-stone text-ghost-content  w-11/12 max-w-5xl glass">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button onClick={onCloseMe} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">{args.title && args.title}</h3>
                    <div className="mockup-code bg-secondary text-secondary-content w-full mt-4 text-md ">
                        <pre className='pl-4'><code>{content && content}</code></pre>
                    </div>
                </div>
            </dialog >
        </>
    )
}
export default ShowCreateDialog