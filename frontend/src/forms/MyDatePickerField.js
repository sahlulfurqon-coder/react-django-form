import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import {Controller} from 'react-hook-form'

export default function MyDatePickerField(props) {
  const {label, width, name, control} = props
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>

          <Controller
            name={name}
            control={control}
            render={({
              field: { onChange, value },

            }) => (
              
                <DateField label={label} sx={{width:{width}}}/>

            )
      
            }
      
          />

    </LocalizationProvider>
  );
}
