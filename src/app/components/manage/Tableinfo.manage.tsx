const ManageTableinfo = ({ tableData = {}, infoKey = 0, onShowDropTable, tablename = "", onShowCreateTable }: any) => {

    return (
        <>

            <div key={infoKey} className="">
                <div className="navbar bg-base-100 shadow-sm">
                    <div className="flex-1">
                        <div className="">Row Count: {tableData.rowcount && tableData.rowcount}</div>
                    </div>
                    <div className="flex-none">
                        <ul className="menu menu-horizontal px-1">
                            <li className="ml-2"><a className="btn-info btn-soft btn-sm btn" onClick={(_ev) => onShowCreateTable(_ev,
                                {
                                    title: "Create Table Schema",
                                    tablename: tablename,
                                    rowkey: infoKey,
                                })}>Show Create</a></li>
                            <li className="ml-2"><a className="btn-warning btn-soft btn-sm btn" onClick={(_ev) => onShowDropTable(_ev,
                                {
                                    title: "Drop Table Confirmation",
                                    tablename: tablename,
                                    confirm: `You are about to drop <strong><code>'${tablename}'</code></strong> table. This action is not reversible.`,
                                    rowkey: infoKey,
                                })}>Drop Table</a></li>
                        </ul>
                    </div>
                </div>

                <table className="table table-xs table-zebra ">
                    <thead className="bg-info/80 text-info-content">
                        <tr>
                            <th>No</th>
                            <th>Field</th>
                            <th>Type</th>
                            <th>Key</th>
                            <th>Null</th>
                            <th>Default</th>
                            <th>Extra</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.columns && tableData.columns.map((column: any, key: number) => {
                            return (
                                <tr key={key}>
                                    <td>{key + 1}</td>
                                    <td>{column.COLUMN_NAME}</td>
                                    <td>{column.COLUMN_TYPE}</td>
                                    <td>{column.COLUMN_KEY}</td>
                                    <td>{column.IS_NULLABLE}</td>
                                    <td>{column.COLUMN_DEFAULT}</td>
                                    <td>{column.EXTRA}</td>
                                </tr>
                            )
                        })}

                    </tbody>
                </table>
            </div>
        </>
    )
}

export default ManageTableinfo