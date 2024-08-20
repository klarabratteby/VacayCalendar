import React, { useState, FormEvent } from "react";
import Form from "./form";
import Button from "../button/button";
import styles from "../form/add-friend-form.module.css";
import { X } from "react-feather";

interface Props {
  onAddFriend: (email: string) => void;
  onClose: () => void;
}

export default function AddFriendForm({ onAddFriend, onClose }: Props) {
  const [email, setEmail] = useState("");
  const handleSubmit = (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onAddFriend(email);
    setEmail("");
  };
  const headerContent = (
    <div className={styles.headerContainer}>
      <X onClick={onClose} className={styles.closeButton} />
    </div>
  );
  return (
    <div className={styles.addFriendContainer}>
      <Form header={headerContent}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter friend's email"
          className={styles.input}
        />
        <div className={styles.submitButton}>
          <Button
            text="Submit"
            backgroundColor="#0C463F"
            textColor="fff"
            onClick={handleSubmit}
            width="5rem"
          />
        </div>
      </Form>
    </div>
  );
}
