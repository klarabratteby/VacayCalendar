import React, { useState } from "react";
import styles from "./event.module.css";
import Form from "@/components/ui/form/form";
import { X } from "react-feather";
import Button from "@/components/ui/button/button";

interface Props {
  onClose: () => void;
  position: { top: number; right: number };
  addedVacay: (vacation: { startDate: Date; endDate: Date }) => void;
}

export default function VacayForm({ onClose, position, addedVacay }: Props) {
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    // Normalize the start and end dates
    const normalizedStartDate = new Date(startDate);
    normalizedStartDate.setHours(0, 0, 0, 0);

    const normalizedEndDate = new Date(endDate);
    normalizedEndDate.setHours(23, 59, 59, 999);

    addedVacay({ startDate: normalizedStartDate, endDate: normalizedEndDate });
    onClose();
  };

  const headerContent = (
    <div className={styles.eventButtonContainer}>
      <X onClick={onClose} className={styles.iconButton} />
    </div>
  );

  return (
    <div
      className={styles.vacationForm}
      style={{ top: position.top, right: position.right }}
    >
      <Form header={headerContent}>
        <div>
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="endDate">End Date</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <Button
          text="Submit"
          backgroundColor=""
          textColor=""
          onClick={handleSubmit}
        />
      </Form>
    </div>
  );
}
