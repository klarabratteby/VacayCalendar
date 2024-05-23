import React, { useRef, useEffect, useState } from "react";
import Form from "@/components/ui/form/form";
import styles from "./event.module.css";
import { Trash2, X, Edit } from "react-feather";
import { format } from "date-fns";

interface Props {
  onClose: () => void;
  onDeleteEvent: () => void;
  position: { top: number; right: number };
  eventData?: EventData | null;
  onEdit: () => void;
}

export interface EventData {
  id?: string;
  title: string;
  date: Date;
  description: string;
}

export default function ReadEventForm({
  onClose,
  onDeleteEvent,
  onEdit,
  position,
  eventData,
}: Props) {
  if (!eventData) return null;

  const { title, date, description } = eventData;

  const headerContent = (
    <div className={styles.eventButtonContainer}>
      <Edit className={styles.iconButton} onClick={onEdit} />
      <Trash2 onClick={onDeleteEvent} className={styles.iconButton} />
      <X onClick={onClose} className={styles.iconButton} />
    </div>
  );

  return (
    <div
      className={styles.AddEventForm}
      style={{ top: position.top, right: position.right }}
    >
      <Form header={headerContent}>
        <div>
          <label htmlFor="title">Title</label>
          <div>{title}</div>
        </div>
        <div>
          <label htmlFor="date">Date</label>
          <div>{format(date, "yyyy-MM-dd")}</div>
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <div>{description}</div>
        </div>
      </Form>
    </div>
  );
}
