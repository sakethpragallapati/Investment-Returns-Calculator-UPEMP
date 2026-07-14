import { Check } from "lucide-react";

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export default function Stepper({ currentStep, totalSteps, steps }: StepperProps) {
  return (
    <div className="stepper">
      {steps.map((label, index) => {
        const stepNum = index + 1;
        const isCompleted = stepNum < currentStep;
        const isActive = stepNum === currentStep;

        return (
          <div key={stepNum} className="step-item">
            <div
              className={`step-circle ${isActive ? "active" : ""} ${
                isCompleted ? "completed" : ""
              }`}
              style={{ position: "relative" }}
            >
              {isCompleted ? <Check size={18} strokeWidth={3} /> : stepNum}
              <div
                className={`step-label ${isActive ? "active" : ""}`}
                style={{ position: "absolute", top: 44, left: "50%", transform: "translateX(-50%)" }}
              >
                {label}
              </div>
            </div>
            {index < totalSteps - 1 && (
              <div className={`step-line ${isCompleted ? "completed" : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
