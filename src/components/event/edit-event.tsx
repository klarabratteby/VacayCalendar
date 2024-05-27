import React, { useRef, useEffect, useState } from "react";
import Form from "@/components/ui/form/form";
import Button from "@/components/ui/button/button";
import styles from "./event.module.css";
import { X } from "react-feather";
import { format } from "date-fns";

interface Props {
  onClose: () => void;
  onEdit: (event: EventData) => void;
  position: { top: number; right: number };
  event: EventData;
}

export interface EventData {
  id?: string;
  title: string;
  date: Date;
  description: string;
  time?: string;
}

export default function EditEventForm({
  onClose,
  onEdit,
  position,
  event,
}: Props) {
  const [title, setTitle] = useState(event.title);
  const [date, setDate] = useState(format(event.date, "yyyy-MM-dd"));
  const [time, setTime] = useState(event.time || "");
  const [description, setDescription] = useState(event.description);
  const ref = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const eventDate = new Date(`${date}T${time || "00:00"}`); // Default time to 00:00 if not provided
    const updatedEvent = {
      ...event,
      title,
      date: eventDate,
      description,
      time,
    };

    onEdit(updatedEvent);
    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchend", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchend", handleClickOutside);
    };
  }, [onClose]);

  const headerContent = (
    <div className={styles.eventButtonContainer}>
      <X onClick={onClose} className={styles.iconButton} />
    </div>
  );

  return (
    <div
      className={styles.AddEventForm}
      style={{ top: position.top, right: position.right }}
      ref={ref}
    >
      <Form header={headerContent}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="time">Time</label>
          <input
            type="time"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <Button
          text="Update Event"
          backgroundColor=""
          textColor=""
          onClick={handleSubmit}
        />
      </Form>
    </div>
  );
}
