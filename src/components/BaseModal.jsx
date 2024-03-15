import React from 'react'

export const ModalForm = (props) => {
  const full = props.full || false
  return (
    <dialog id={props.id || 'modalForm'} className={`modal ${full ? 'px-12' : ''}`}>
      <div className={`modal-box h-fit ${full ? 'min-w-fit' : ''}`}>
        {props.fill}
        <div className="modal-action">
          <form method="dialog">
            <button className="btn" id={props.idCloseBtn || 'closeBtn'} onClick={props.onClickCloseBtn}>{props.closeText || 'Kembali'}</button>
          </form>
          {props.addButton}
        </div>
      </div>
    </dialog>
  )
}

export const ModalAlert = (props) => {
  return (
    <dialog id={props.id} className='modal'>
      <div className="modal-box">
        <p className='text-lg text-center'>{props.text}</p>

        <div className='modal-action flex justify-center'>
          <form method='dialog'>
            <button className="btn" id={props.idCloseBtn}>{props.closeText || 'Kembali'}</button>
          </form>
          {props.addButton}
        </div>
      </div>
    </dialog>
  )
}
