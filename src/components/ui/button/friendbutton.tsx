import React, { useState } from "react";
import styles from "../button/friendbutton.module.css";
import { Trash2 } from "react-feather";

interface Props {
  text: string;
  onDeleteClick: (event: React.MouseEvent<SVGElement>) => void;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function FriendButton(props: Props) {
  const [hover, setHover] = useState(false);

  return (
    <div className={styles.friendButtonContainer}>
      <button className={styles.friendButton} onClick={props.onClick}>
        {props.text}
        <Trash2
          className={styles.trashIcon}
          onClick={(e) => {
            e.stopPropagation();
            props.onDeleteClick(e);
          }}
        />
      </button>
    </div>
  );
}
