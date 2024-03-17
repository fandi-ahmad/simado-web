// import React from 'react'
import { React, useState, useEffect } from 'react'
import { useGlobalState } from '../state/state'

const inputClass = ' border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500'

export const BaseInput = (props) => {
  return (
    <div className={props.className} id={props.idField}>
      <div>
        {props.text ? <p className="pt-4 mb-2">{props.text}</p> : null}
        <input type={props.type || 'text'} name={props.name} id={props.id} value={props.value} onChange={props.onChange} placeholder={props.placeholder} className={"w-full"+inputClass} />
      </div>
      <p className={'text-red-400 text-sm hidden '+props.classError} id={props.idError}>{props.errorText || 'Input tidak boleh kosong'}</p>
    </div>
  )
}

export const InputColumn = (props) => {
  const required = () => {
    if (props.required) {
      return <span className='text-red-400'>*</span>
    }
  }
  return (
    <div className={'flex justify-between w-full mb-2 '+ props.className} id={props.idField}>
      <p className="pt-4 mb-2 mr-24">{props.text}{required()}</p>
      <div>
        <input type={props.type || 'text'} name={props.name} id={props.id} value={props.value} onChange={props.onChange} className={"w-96"+inputClass} />
        <p className={'text-red-400 text-sm hidden '+props.classError} id={props.idError}>{props.errorText || 'Input tidak boleh kosong'}</p>
      </div>
    </div>
  )
}

export const SelectInput = (props) => {
  return (
    <div className='mb-2'>
      <p className="pt-4 mb-2">{props.text}</p>
      <select id={props.id} onChange={props.onChange} name={props.name} className={`${props.classInput || ''} ${inputClass} cursor-pointer w-full`}>
        <option>-</option>
        {props.option}
      </select>
    </div>
  )
}

export const SelectInputColumn = (props) => {
  const required = () => {
    if (props.required) {
      return <span className='text-red-400'>*</span>
    }
  }
  return (
    <div className='mb-2 flex justify-between w-full'>
      <p className="pt-4 mb-2 mr-2">{props.text}{required()}</p>
      <select id={props.id} onChange={props.onChange} name={props.name} className={`${props.classInput || ''} ${inputClass} cursor-pointer w-96`}>
        <option>-</option>
        {props.option}
      </select>
    </div>
  )
}

export const InputFile = (props) => {
  const required = () => {
    if (props.required) {
      return <span className='text-red-400'>*</span>
    }
  }

  return (
    <div className='flex justify-between w-full mb-2' onClick={() => document.getElementById(props.id).click()}>
      <p className="pt-4 mb-2 mr-24">{props.text}{required()}</p>

      <div>
        <label className="custum-file-upload custum-file-upload-border flex w-96" id={props.idLabelInput || 'idLabelInput'} htmlFor="file">
          <div className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="" viewBox="0 0 24 24"><g strokeWidth="0" id="SVGRepo_bgCarrier"></g><g strokeLinejoin="round" strokeLinecap="round" id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <path fill="" d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z" clipRule="evenodd" fillRule="evenodd"></path> </g></svg>
          </div>
          <div className="text">
            <span>{props.textIn || 'Klik untuk upload file'}</span>
          </div>
          <input type='file' name={props.name} id={props.id} value={props.value} onChange={props.onChange} />
        </label>
        <p className={'text-red-400 text-sm hidden '+props.classError} id={props.idError}>{props.errorText || 'Input tidak boleh kosong'}</p>
      </div>
    </div>
  )
}


export const SearchInput = (props) => {
  /*
    data: data array
    onSelect: event onClick in data list
  */

  const [isOpen, setIsOpen] = useState(false);
  // const [searchTerm, setSearchTerm] = useState('');
  const [searchTerm, setSearchTerm] = useGlobalState('searchTerm')
  const [searchResults, setSearchResults] = useState([]);

  const handleInputChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    // Filter the data based on search term
    const results = props.data.filter((item) =>
      item.name.toLowerCase().includes(term.toLowerCase()) ||
      item.nisn.includes(term)
    );
    setSearchResults(results);
    setIsOpen(true);
  };

  const handleItemClick = (item) => {
    setSearchTerm(`${item.nisn} - ${item.name}`);
    setIsOpen(false);
    // Call onSelect prop to pass the selected item's id
    props.onSelect(item.id);
  };

  const handleOutsideClick = (event) => {
    if (event.target.closest('.search-input-container') === null) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    // Listen for outside clicks to close the dropdown
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <div className="relative search-input-container w-96">
      <input
        type="search"
        id={props.id}
        placeholder="Cari..."
        value={searchTerm}
        onChange={handleInputChange}
        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
      />

      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded border border-gray-200">
          {searchResults.map((item, index) => (
            <li
              key={index}
              onClick={() => handleItemClick(item)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              {item.nisn} - {item.name}
            </li>
          ))}
        </ul>
      )}

      <p className={'text-red-400 text-sm hidden '+props.classError} id={props.idError}>{props.errorText || 'Input tidak boleh kosong'}</p>
    </div>
  );
};

