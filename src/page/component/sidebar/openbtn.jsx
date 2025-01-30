import React from 'react';
import Button from 'react-bootstrap/Button';
import { FaListUl } from 'react-icons/fa';


function OpenBtn({ onClick }) {
  return (
    <Button className="openbtn" onClick={onClick}>
        <FaListUl />
    </Button>
  );
}

export default OpenBtn;