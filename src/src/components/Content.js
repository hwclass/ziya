// Core
import React, { PropTypes } from 'react';

// UI
import Codemirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/markdown/markdown';

const Content = ({ value, onKeyDown, onChange, options }) => (
  <div
    id="Content"
    className={value ? '' : 'hidden'}
    onKeyDown={onKeyDown}
  >
    <Codemirror
      className="Editor"
      value={value}
      onChange={onChange}
      options={options}
    />
  </div>
);

Content.propTypes = {
  value: PropTypes.string,
  handleKeyDown: PropTypes.func,
  onChange: PropTypes.func,
  options: PropTypes.object,
};

export default Content;
