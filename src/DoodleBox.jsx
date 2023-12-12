import React from 'react';

const DoodleBox = ({ title, children }) => {
  return (
    <fieldset className="doodle-box">
      {title && <legend>{title}</legend>}
        {children}
    </fieldset>
  );
};

export default DoodleBox;
