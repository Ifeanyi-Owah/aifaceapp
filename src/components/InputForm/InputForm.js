import React from 'react';
import './InputForm.css';


const InputForm = ({ handleChange, handleClick }) => {
  return (
    <div className='ma4 mt0'>
      <p className="f3">
        {'AI intelligent computer face detection'}
      </p>
      <div className="center">
        <form className="center pa4 br3 shadow-5 form">
          <input className="f4 pa2 w-70 center" type="text" onChange={handleChange} />
          <button className="w-30 grow f4 link ph3 pv2  dib white"
            onClick={handleClick}
          >Detect</button>
        </form>
      </div>
    </div>
  );
}

export default InputForm;