import styles from "../button/button.module.css";
import React, { useState } from "react";

interface Props {
  text: string;
  backgroundColor: string;
  textColor: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Button(props: Props) {
  const [hover, setHover] = useState(false);

  const buttonStyle = {
    backgroundColor: hover ? "rgba(3, 29, 68, 0.6)" : props.backgroundColor,
    color: props.textColor,
  };

  return (
    <button
      className={styles.primButton}
      onClick={props.onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={buttonStyle}
    >
      {props.text}
    </button>
  );
}
