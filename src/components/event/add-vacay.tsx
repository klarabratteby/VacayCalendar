import React, { useState, useEffect } from "react";
import styles from "./event.module.css";
import Form from "@/components/ui/form/form";
import { X, PlusCircle } from "react-feather";
import Button from "@/components/ui/button/button";
import { Trash2 } from "react-feather";

interface Props {
  onClose: () => void;
  position: { top: number; right: number };
  addedVacay: (vacation: VacayData[]) => void;
  vacations: VacayData[];
}

export interface VacayData {
  id?: string;
  title: string;
  startDate: Date;
  endDate: Date;
}

export default function VacayForm({
  onClose,
  position,
  addedVacay,
  vacations,
}: Props) {
  const [vacationForms, setVacationForms] = useState<
    { title: string; startDate: string; endDate: string }[]
  >([
    {
      title: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
    },
  ]);

  // Initialize form with existing vacations when the form is opened
  useEffect(() => {
    // Ensures that exsisting vacation dates are displayed in the right timezone
    const formatDate = (date: Date) => date.toLocaleDateString("sv-SE");
    if (vacations.length > 0) {
      const formattedVacations = vacations.map(
        ({ title, startDate, endDate }) => ({
          title: title ?? "",
          startDate: formatDate(new Date(startDate)),
          endDate: formatDate(new Date(endDate)),
        })
      );
      setVacationForms(formattedVacations);
    } else {
      const today = new Date();
      setVacationForms([
        {
          title: "",
          startDate: formatDate(today),
          endDate: formatDate(today),
        },
      ]);
    }
  }, [vacations]);

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const setVacations: VacayData[] = vacationForms.map((form) => ({
      title: form.title,
      startDate: new Date(`${form.startDate}T00:00:00`),
      endDate: new Date(`${form.endDate}T23:59:59`),
    }));
    await addedVacay(setVacations);
    onClose();
  };

  const handleAddVacationForm = () => {
    setVacationForms((prevForms) => [
      ...prevForms,
      {
        title: "",
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
    setVacationForms((prevForms) => {
      const updatedForms = prevForms.map((form, i) =>
        i === index ? { ...form, [field]: value } : form
      );
      return updatedForms;
    });
  };

  const handleRemoveVacationForm = (index: number) => {
    const updatedForms = vacationForms.filter((_, i) => i !== index);
    setVacationForms(updatedForms);
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
            <Trash2
              className={styles.trashIcon}
              onClick={() => handleRemoveVacationForm(index)}
            />
            <div>
              <label htmlFor={`title-${index}`}>Title</label>
              <input
                type="text"
                id={`title-${index}`}
                value={form.title}
                onChange={(e) =>
                  handleVacationChange(index, "title", e.target.value)
                }
              />
            </div>
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
          </div>
        ))}
        <div className={styles.submitButton}>
          <Button
            text="Submit"
            backgroundColor="#031D44"
            textColor="fff"
            onClick={handleSubmit}
            width="8rem"
          />
        </div>
      </Form>
    </div>
  );
}
