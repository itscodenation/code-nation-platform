import React, {useState} from 'react';
import ReactDatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import CenterAll from './layout/CenterAll';
import Button from 'react-bootstrap/Button';
import {format, addDays, isWeekend} from 'date-fns';

function nextWeekday(date = new Date()) {
  const nextDay = addDays(date, 1);
  if (isWeekend(nextDay)) {
    return nextWeekday(nextDay);
  }
  return nextDay;
}

export default function DatePicker({
  defaultDate = nextWeekday(),
  header = 'When is the program session?',
  onPick,
}) {
  const [selected, updateSelected] = useState(defaultDate);

  return (
    <CenterAll>
      <h2>{header}</h2>
      <div>
        <ReactDatePicker
          inline
          minDate={new Date()}
          selected={selected}
          onChange={date => updateSelected(date)}
        />
      </div>
      <Button size="lg" variant="primary" onClick={() => onPick(selected)}>
        {format(selected, 'MMMM d')}
      </Button>
    </CenterAll>
  );
}
