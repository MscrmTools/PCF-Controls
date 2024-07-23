
import * as React from 'react';
import DateRangePicker from 'rsuite/DateRangePicker';
import CustomProvider from 'rsuite/CustomProvider';
import frFR from 'rsuite/locales/fr_FR';
import 'rsuite/dist/rsuite.min.css';
//import 'rsuite/styles/index.less';
import './CustomTheme.less'

const { allowedMaxDays, allowedDays, allowedRange, beforeToday, afterToday, combine } =  DateRangePicker;

export interface IDateRangePickerProps {
  startDate:Date | null,
  endDate:Date | null,
  enabled:boolean,
  useOneCalendar:boolean,
  useWeeksNumber:boolean,
  dateFormat:string,
  placeholder:string,
  character:string,
  calendarCallback: (startDate:Date | null, endDate:Date | null) => void;
}


const MyDateRangePicker = (props:IDateRangePickerProps): JSX.Element => {

  type ValueType = [Date, Date];

  const [startDate, setStartDate] = React.useState<Date | null>(props.startDate);
  const [endDate, setEndDate] = React.useState<Date | null>(props.endDate);

  const SetDates = (newValue: ValueType)=>{
    setStartDate(newValue[0]);
    setEndDate(newValue[1]);
  }

  const cleanDates=(event:any)=>{
    debugger;
    setStartDate(null);
    setEndDate(null);
  }

  React.useEffect(()=>{
    if(startDate != props.startDate){
        props.calendarCallback(startDate, endDate);
    }
  },[startDate]);

  React.useEffect(()=>{ 
    if(endDate != props.endDate){
      props.calendarCallback(startDate, endDate);
  }
  },[endDate]);

  return (
    <> 
      <CustomProvider  locale={frFR}>
        <DateRangePicker
        block = {true}
        disabled={!props.enabled}
        cleanable={true}
        isoWeek = {true}
        onOk={SetDates}
        onClean={cleanDates}
        format={props.dateFormat}
        appearance = "subtle"
        character= {props.character}
        placeholder = {props.placeholder}
        disabledDate={combine?.(allowedMaxDays?.(7), beforeToday?.())} 
        showOneCalendar = {props.useOneCalendar}
        showWeekNumbers = {props.useWeeksNumber}
        defaultValue = {[startDate , endDate ]}
        value = {[startDate , endDate ]}
        ranges = {[]}
        />
    </CustomProvider >
    </>
  )
};
export default MyDateRangePicker;

