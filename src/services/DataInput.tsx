import React from 'react';
import { useField } from 'formik';

interface DateInputProps {
  label: string;
  name: string;
}

const DateInput: React.FC<DateInputProps> = ({ label, name }) => {
  const [field, , helpers] = useField(name);
  const { day, month, year } = field.value || {};

  const handleChange = (part: string, value: string) => {
    helpers.setValue({ ...field.value, [part]: value });
  };

  return (
    <div className="form-group">
      <label>{label}</label>
      <div className="date-of-birth">
        <input
          type="text"
          placeholder="Day"
          value={day || ''}
          onChange={(e) => handleChange('day', e.target.value)}
        />
        <input
          type="text"
          placeholder="Month"
          value={month || ''}
          onChange={(e) => handleChange('month', e.target.value)}
        />
        <input
          type="text"
          placeholder="Year"
          value={year || ''}
          onChange={(e) => handleChange('year', e.target.value)}
        />
      </div>
    </div>
  );
};

export default DateInput;