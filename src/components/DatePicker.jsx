import React, {useState} from 'react';
import ReactDatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import CenterAll from './layout/CenterAll';
import Button from 'react-bootstrap/Button';
import {format, startOfTomorrow} from 'date-fns';

export default function DatePicker({onPick}) {
  const [selected, updateSelected] = useState(startOfTomorrow());

  return (
    <CenterAll>
      <h2>When is the program session?</h2>
      <div>
        <ReactDatePicker
          inline
          minDate={new Date()}
          selected={selected}
          onChange={date => updateSelected(date)}
        />
      </div>
      <Button size="lg" variant="primary" onClick={() => onPick(selected)}>
        {format(selected, 'MMMM D')}
      </Button>
    </CenterAll>
  );
}
