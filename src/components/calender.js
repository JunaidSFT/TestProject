import React, { useState, useEffect } from "react";
import FullCalendar from '@fullcalendar/react'; 
import timelinePlugin from '@fullcalendar/timeline';
import axios from 'axios';
import moment from 'moment';
import DateTime from 'react-datetime';

import 'react-datetime/css/react-datetime.css';


import './style.css';


export default function Calender () {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const calendarRef = React.useRef()

  const fetchData = React.useCallback(() => {
    axios({
      "method": "GET",
      "url": "http://localhost:5005/customer-details ",
    })
    .then((response) => {
      let array = [];
      let colors = ['#FF6263', '#01DCEB', '#FFCC12', '#63B4FF']
      response.data.forEach((element,i) => {
        array.push({"start": element.orderDate+'T'+moment(element.orderTime, ["h:mm A"]).format("HH:mm"),
                     "title": element.customerDetail.firstName+' '+ element.customerDetail.lastName,
                    "groupId":element.orderId,
                    "url":colors[i]})
      });
      setData(array)
      console.log(array)
      console.log(response.data)
    })
    .catch((error) => {
      console.log(error)
    })
  }, [])
  
  useEffect(() => {
    fetchData()
  }, [fetchData])

    const events = [ 
    {
      title  : 'Junaid',
      start  : '2021-10-20T02:30:00',
      end : '2021-10-20T08:30:00',
      groupId   : 'Order Id:79408',
      url : '#FF6263'
    },
    {
      title  : 'Ali Ahmed',
      start  : '2021-10-20T07:30:00',
      groupId : 'Order Id: 14375',
      url : '#01DCEB'
    },
    {
      title   :  'Hamza ',
      start   :  '2021-10-20T17:30:00',
      groupId :  'Order Id: 24879',
      url : '#01DCEB'
    }

];

useEffect(() => {
  let calendarApi = calendarRef.current.getApi()
  calendarApi.gotoDate(startDate);
}, [startDate])


function renderEventContent(eventInfo) {
    return (
      <>
      <div className = "outer-wrap">
        <div className="inner-wrap" style = {{backgroundColor: `${eventInfo.event.url}`}}>
            <div className="image-section">
                <span className="icon fa-stack" style={{verticalAlign: 'top', color: `${eventInfo.event.url}`}} onClick = {() => {console.log(eventInfo.event.groupId)}}>
                    <i className="fas fa-circle fa-stack-2x" />
                    <i className="fas fa-chevron-right fa-stack-1x fa-inverse" />
                </span><h3 className="text">{eventInfo.event.title}</h3>
                <h4 className="text">Order Id: {eventInfo.event.groupId}</h4>
                {console.log(eventInfo)}
            </div>
        </div>
        </div>
      </>
    )
  };

  const handleChangeDate = (value) => {
        setStartDate(value._d);
        console.log(value._d);
  }

    return (
      <div>
        <div className="text-box">
          <a href="#" className="btn btn-white btn-animate"><i className=" icon-plus fas fa-plus"></i>   Create New Order</a>
        </div>

        <DateTime timeFormat={false} 
                  inputProps={{ placeholder: 'Datepicker' }} 
                  initialValue = {startDate} 
                  closeOnSelect={true}
                  onChange = {handleChangeDate} 
                  className = "date-picker"
          />
        <FullCalendar
        plugins={[ timelinePlugin ]}
        initialView='timeline'
        headerToolbar={{
          start: '',
          center: 'title',
          end: '', 
        }}
        events = { data }
        ref = { calendarRef }
        eventColor = '#fff'
        eventContent = { renderEventContent }
        eventOverlap = { false }
       
        
      />
      </div>
    )

}