import React, { useState } from "react";
import styles from "./event.module.css";
import Form from "@/components/ui/form/form";
import { X, PlusCircle } from "react-feather";
import Button from "@/components/ui/button/button";
import { BsTrash } from "react-icons/bs";

interface Props {
  onClose: () => void;
  position: { top: number; right: number };
  addedVacay: (vacation: VacayData[]) => void;
  vacations: { startDate: Date; endDate: Date }[];
  onDeleteVacation: () => void;
}

export interface VacayData {
  startDate: Date;
  endDate: Date;
}

export default function VacayForm({
  onClose,
  position,
  addedVacay,
  vacations,
  onDeleteVacation,
}: Props) {
  const [vacationForms, setVacationForms] = useState<
    { startDate: string; endDate: string }[]
  >([
    {
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
    },
  ]);

  const handleAddVacationForm = () => {
    setVacationForms((prevForms) => [
      ...prevForms,
      {
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
      },
    ]);
  };

  const handleVacationChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedForms = vacationForms.map((form, i) =>
      i === index ? { ...form, [field]: value } : form
    );
    setVacationForms(updatedForms);
  };

  const handleRemoveVacationForm = (index: number) => {
    const updatedForms = vacationForms.filter((_, i) => i !== index);
    setVacationForms(updatedForms);
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const setVacations: VacayData[] = vacationForms.map((form) => ({
      startDate: new Date(form.startDate),
      endDate: new Date(form.endDate),
    }));
    await addedVacay(setVacations);
    onClose();
  };

  const headerContent = (
    <div className={styles.eventButtonContainer}>
      <PlusCircle
        onClick={handleAddVacationForm}
        className={styles.iconButton}
      />
      <X onClick={onClose} className={styles.iconButton} />
    </div>
  );

  return (
    <div
      className={styles.vacationForm}
      style={{ top: position.top, right: position.right }}
    >
      <Form header={headerContent}>
        {vacationForms.map((form, index) => (
          <div key={index} className={styles.vacationItem}>
            <div>
              <label htmlFor={`startDate-${index}`}>Start Date</label>
              <input
                type="date"
                id={`startDate-${index}`}
                value={form.startDate}
                onChange={(e) =>
                  handleVacationChange(index, "startDate", e.target.value)
                }
              />
            </div>
            <div>
              <label htmlFor={`endDate-${index}`}>End Date</label>
              <input
                type="date"
                id={`endDate-${index}`}
                value={form.endDate}
                onChange={(e) =>
                  handleVacationChange(index, "endDate", e.target.value)
                }
              />
            </div>
            <BsTrash onClick={() => handleRemoveVacationForm(index)} />
          </div>
        ))}
        <Button
          text="Submit"
          backgroundColor="#031D44"
          textColor="fff"
          onClick={handleSubmit}
        />
      </Form>
    </div>
  );
}
