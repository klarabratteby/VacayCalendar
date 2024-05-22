import React, {useRef, useEffect, useState} from 'react';
import Form from '@/components/ui/form/form';
import Button from '@/components/ui/button/button';
import styles from './event.module.css';
import {Trash2,X,Edit} from "react-feather";


interface Props {
  onClose: () => void;
  onEventAdded: (event: EventData) => void;
  onDeleteEvent: () => void;
  position: { top: number; right: number };
  
}

export interface EventData {
  title: string;
  date: Date;
  description: string;
  
}


export default function AddEventForm({onClose, onEventAdded, onDeleteEvent, position} : Props) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description,setDescription] = useState('');
  const ref = useRef<HTMLDivElement>(null); 
  
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    console.log("Submitting form...");
    console.log("Title:", title);
    console.log("Date:", date);
    console.log("Time:", time);
    console.log("Description:", description);

    const event = {
      title, 
      date: new Date(date + 'T' + time),
      description
    };

    onEventAdded(event);
    

    // Reset form
    setTitle('');
    setDate('');
    setTime('');
    setDescription('');

    onClose();

};

// When a user clicks outside of the AddEventForm
useEffect(() => {

  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      onClose();
    }

  };
  document.addEventListener('mousedown', handleClickOutside);
  document.addEventListener('touchend', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
    document.removeEventListener('touchend', handleClickOutside);
  };
}, [onClose]);


const headerContent = (
  <div className={styles.eventButtonContainer}>
    <Edit className={styles.iconButton}/>
    <Trash2 onClick={onDeleteEvent} className={styles.iconButton} />
    <X onClick={onClose} className={styles.iconButton} />
  </div>
);



return (
  <div className={styles.AddEventForm} style={{ top: position.top, right: position.right}} ref={ref}>
  <Form header={headerContent}>
      <div>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label htmlFor="date">Date</label>
        <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div>
        <label htmlFor="time">Time</label>
        <input type="time" id="time" value={time} onChange={(e) => setTime(e.target.value)} />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <Button text="Add Event" onClick={handleSubmit} />

  </Form>
  </div>
);


}