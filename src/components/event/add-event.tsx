import React, { useRef, useEffect, useState } from "react";
import Form from "@/components/ui/form/form";
import Button from "@/components/ui/button/button";
import styles from "./event.module.css";
import { X } from "react-feather";
import { auth } from "@/lib/firebaseConfig";

interface Props {
  onClose: () => void;
  onEventAdded: (event: EventData) => void;
  position: { top: number; right: number };
  event?: EventData | null;
}

export interface EventData {
  id?: string;
  title: string;
  date: Date;
  description: string;
  time?: string;
  createdBy: string;
}

export default function AddEventForm({
  onClose,
  onEventAdded,
  position,
}: Props) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const eventDate = new Date(`${date}T${time || "00:00"}`); // if time isnt provided => default set to 00
    const event = {
      title,
      date: eventDate,
      description,
      time,
      createdBy: auth.currentUser?.uid || "unknown",
    };

    onEventAdded(event);

    // Reset form
    setTitle("");
    setDate("");
    setTime("");
    setDescription("");

    onClose();
  };

  // When a user clicks outside of the AddEventForm
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
        <div className={styles.formContent}>
          <div className={styles.formInput}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className={styles.formDate}>
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className={styles.formDate}>
            <label htmlFor="time">Time</label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div className={styles.formInput}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className={styles.submitButton}>
            <Button
              text="Add Event"
              backgroundColor="#0C463F"
              textColor="fff"
              onClick={handleSubmit}
              width="8rem"
            />
          </div>
        </div>
      </Form>
    </div>
  );
}
