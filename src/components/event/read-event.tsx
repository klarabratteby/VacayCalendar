import React, { useRef, useEffect, useState } from "react";
import Form from "@/components/ui/form/form";
import styles from "./event.module.css";
import { Trash2, X, Edit } from "react-feather";
import { format } from "date-fns";
import EditEventForm from "./edit-event";

interface Props {
  onClose: () => void;
  onDeleteEvent: () => void;
  position: { top: number; right: number };
  eventData?: EventData | null;
  onEdit: (event: EventData) => void;
  canEdit: boolean;
}

export interface EventData {
  id?: string;
  title: string;
  date: Date;
  description: string;
  time?: string;
  createdBy: string;
}

export default function ReadEventForm({
  onClose,
  onDeleteEvent,
  onEdit,
  position,
  eventData,
  canEdit,
}: Props) {
  if (!eventData) return null;

  const { title, date, description, time } = eventData;
  const [editMode, setEditMode] = useState(false);

  const handleEdit = () => setEditMode(true);
  const handleExitEdit = () => setEditMode(false);

  if (editMode) {
    return (
      <EditEventForm
        onClose={handleExitEdit}
        onEdit={onEdit}
        position={position}
        event={eventData}
      />
    );
  }

  const headerContent = (
    <div className={styles.eventButtonContainer}>
      {canEdit ? (
        <>
          <Edit className={styles.iconButton} onClick={handleEdit} />
          <Trash2 onClick={onDeleteEvent} className={styles.iconButton} />
        </>
      ) : null}
      <X onClick={onClose} className={styles.iconButton} />
    </div>
  );

  return (
    <div
      className={styles.AddEventForm}
      style={{ top: position.top, right: position.right }}
    >
      <Form header={headerContent}>
        <div className={styles.formContent}>
          <div className={styles.formInput}>
            <label htmlFor="title">Title</label>
            <div>{title}</div>
          </div>
          <div className={styles.formInput}>
            <label htmlFor="date">Date</label>
            <div>{format(date, "yyyy-MM-dd")}</div>
          </div>
          {time && ( // Conditionally render time if it exists
            <div className={styles.formInput}>
              <label htmlFor="time">Time</label>
              <div>{format(date, "HH:mm")}</div>
            </div>
          )}
          <div className={styles.createSpaceContainer}>
            <div className={styles.formInput}>
              <label htmlFor="description">Description</label>
              <div>{description}</div>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}
