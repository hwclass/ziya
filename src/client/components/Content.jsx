/* eslint-disable jsx-a11y/no-static-element-interactions */

// Core
import React, { PropTypes } from 'react';

// UI
import Codemirror from 'react-codemirror';

import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/markdown/markdown';

import './Content.css';

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
  value: PropTypes.string.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.object.isRequired,
};

export default Content;

/* eslint-enable jsx-a11y/no-static-element-interactions */
