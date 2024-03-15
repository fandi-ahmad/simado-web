export const TableHead = (props) => {
  return (
    <th className={`${props.className} pl-6 py-3 font-bold text-left capitalize align-middle border-b border-gray-200 shadow-none text-sm border-b-solid tracking-none whitespace-nowrap text-slate-800 opacity-70`}>
      {props.text}
    </th>
  )
}

export const TableData = (props) => {
  return (
    <td className={`p-2 ${props.pl || 'pl-6'} bg-transparent border-b whitespace-nowrap shadow-transparent  ${props.className}`}>
      <span className='text-xs font-semibold leading-tight text-slate-400'>{props.text}</span>
    </td>
  )
}


export const BaseTable = (props) => {
  return (
    <div className={`flex-none w-full max-w-full px-3 ${props.className}`}>
      <div className="relative flex flex-col min-w-0 mb-6 break-words bg-white border-0 border-transparent border-solid shadow-soft-xl rounded-2xl bg-clip-border">
        <div className="p-6 pb-0 mb-0 bg-white border-b-0 border-b-solid rounded-t-2xl border-b-transparent">
          <h6>{props.name}</h6>
        </div>
        <div className="flex-auto px-0 pt-0 pb-2">
          <div className="p-0 ">
            <table className="items-center w-full mb-0 align-top text-slate-500">
              <thead className="align-bottom">
                <tr>
                  {props.thead}
                </tr>
              </thead>
              <tbody>
                {props.tbody}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export const ActionListData = (props) => {
  return (
    <li onClick={props.onClick}>
      <a className='py-1'>
        <i className={`fa-solid ${props.icon} w-4`}></i>
        <span className='pb-1'>{props.text}</span>
      </a>
    </li>
  )
}

export const ListDataForDetail = (props) => {
  return (
    <tr>
      <td className='font-bold pb-2 pr-6'>{props.label}</td>
      <td>{props.value}</td>
    </tr>
  )
}