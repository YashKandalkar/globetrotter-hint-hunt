import React from "react";
import { useWindowSize } from "react-use";
import ReactConfetti from "react-confetti";

interface ConfettiProps {
  show: boolean;
}

const Confetti = ({ show }: ConfettiProps) => {
  const { width, height } = useWindowSize();

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <ReactConfetti
        width={width}
        height={height}
        recycle={false}
        numberOfPieces={500}
        gravity={0.1}
        colors={[
          "#26ccff",
          "#a25afd",
          "#ff5e7e",
          "#88ff5a",
          "#fcff42",
          "#ffa62d",
          "#ff36ff",
        ]}
      />
    </div>
  );
};

export default Confetti;
