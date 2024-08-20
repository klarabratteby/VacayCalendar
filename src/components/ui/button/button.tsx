import styles from "../button/button.module.css";
import React, { useState } from "react";

interface Props {
  text: string;
  backgroundColor: string;
  textColor: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  width?: string;
}

export default function Button(props: Props) {
  const [hover, setHover] = useState(false);

  const buttonStyle = {
    backgroundColor: hover ? "rgba(12, 70, 63, 0.6)" : props.backgroundColor,
    color: props.textColor,
    width: props.width,
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
