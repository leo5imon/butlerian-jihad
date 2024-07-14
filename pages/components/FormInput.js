import React from 'react';
import { Tooltip } from "react-tooltip";
import { AiOutlineQuestionCircle } from "react-icons/ai";

const FormInput = ({ label, value, onChange, tooltipId, tooltipContent }) => (
  <div className="form-input">
    <div className="input-label">
      <label>{label}</label>
      {tooltipContent && (
        <>
          <div className="tooltip" data-tooltip-id={tooltipId} data-tooltip-delay-hide={50} data-tooltip-html={tooltipContent}>
            <AiOutlineQuestionCircle />
          </div>
          <Tooltip id={tooltipId} />
        </>
      )}
    </div>
    <input className="input-elem" type="text" value={value} onChange={onChange} />
  </div>
);

export default FormInput;