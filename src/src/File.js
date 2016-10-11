import React from 'react';
import './File.css';

const File = ({ name, onClick }) => {
	return(
		<p onClick={onClick}>{name}</p>
	)
};

export { File };