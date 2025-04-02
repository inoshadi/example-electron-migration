import React from 'react'
const JsonFormatter = ({ jsonData = {} }) => {


    class PreFormattedCode extends React.Component {
        render() {
            return <React.Fragment>{jsonData && JSON.stringify(jsonData, undefined, 2).split('\\n').map((item, key) => {
                return (<div className='ml-6' key={key}>{item}</div>)
            })}</React.Fragment>
        }
    }

    return (
        <>
            <div className="mockup-code w-full">
                <pre><code style={{ whiteSpace: "pre-line" }}><PreFormattedCode /></code></pre>
            </div>
        </>
    )
}



export default JsonFormatter