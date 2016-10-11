import React from 'react';
import './File.css';

const File = ({ name, onClick }) => {
	return(
		<p className="item" onClick={onClick}>{name}</p>
	)
};

export { File };