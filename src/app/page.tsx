"use client";
import { useEffect, useRef } from "react";
import styles from "../app/page.module.css";

export default function Home() {
  const isTyping = useRef(false); // Keeps track if the typing is ongoing

  useEffect(() => {
    const typewriterEffect = async () => {
      const typewriter = document.querySelector(`.${styles.typewriter}`);
      if (typewriter && !isTyping.current) {
        // Proceed only if not already typing
        isTyping.current = true;
        typewriter.textContent = "";

        // First sentence
        await typeSentence(typewriter, "Hi, Welcome to VacayCalendar.", 80);

        // Pause before clearing
        await pause(1000);

        // Clear first sentence
        await clearSentence(typewriter, 50);

        // Second sentence
        await typeSentence(typewriter, "Let's Plan! ", 80);

        isTyping.current = false; // Reset typing state
      }
    };

    typewriterEffect();
  }, []);

  return (
    <main className={styles.main}>
      <h1 className={styles.typewriter}></h1>
    </main>
  );
}

const typeSentence = (element: Element, sentence: string, speed: number) => {
  return new Promise<void>((resolve) => {
    let i = 0;
    const interval = setInterval(() => {
      element.textContent += sentence[i];
      i++;
      if (i === sentence.length) {
        clearInterval(interval);
        resolve();
      }
    }, speed);
  });
};

const clearSentence = (element: Element, speed: number) => {
  return new Promise<void>((resolve) => {
    const sentence = element.textContent || "";
    let i = sentence.length;
    const interval = setInterval(() => {
      element.textContent = sentence.substring(0, i);
      i--;
      if (i < 0) {
        clearInterval(interval);
        resolve();
      }
    }, speed);
  });
};

const pause = (duration: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, duration); // uses milliseconds
  });
};
