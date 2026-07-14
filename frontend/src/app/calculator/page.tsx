"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Stepper from "@/components/wizard/Stepper";
import StepInvestment from "@/components/wizard/StepInvestment";
import StepWorkforce from "@/components/wizard/StepWorkforce";
import StepCSCategory from "@/components/wizard/StepCSCategory";
import StepOptional from "@/components/wizard/StepOptional";
import { INITIAL_FORM_DATA, CalculateRequest } from "@/lib/types";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";

const STEPS = [
  "Capital Investment",
  "Workforce & Location",
  "CS Category",
  "Optional Details"
];

export default function CalculatorPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CalculateRequest>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load from local storage if exists (to persist on refresh)
  useEffect(() => {
    const saved = localStorage.getItem("upemc_draft");
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const updateData = (fields: Partial<CalculateRequest>) => {
    setFormData((prev) => {
      const next = { ...prev, ...fields };
      localStorage.setItem("upemc_draft", JSON.stringify(next));
      return next;
    });
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep((p) => p + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      submitForm();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((p) => p - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    // Base64 encode the form data to pass via URL (No DB!)
    const payload = btoa(JSON.stringify(formData));
    router.push(`/results?q=${payload}`);
  };

  const isStepValid = () => {
    if (currentStep === 1) {
      return formData.new_machinery > 0;
    }
    return true;
  };

  return (
    <div className="section-spacing" style={{ background: "var(--bg-secondary)", minHeight: "calc(100vh - 64px)" }}>
      <div className="container-main" style={{ maxWidth: 800 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 8 }}>Incentive Calculator</h1>
          <p style={{ color: "var(--text-secondary)" }}>Fill out your project details to see your estimated UPEMP 2020 subsidies.</p>
        </div>
        <Stepper currentStep={currentStep} totalSteps={STEPS.length} steps={STEPS} />
      </div>

      <div className="container-main" style={{ maxWidth: currentStep >= 3 ? 1300 : 1000, transition: "max-width 0.4s cubic-bezier(0.4, 0, 0.2, 1)" }}>

        <div className="glass-card" style={{ padding: "40px", minHeight: 360 }}>
          {currentStep === 1 && <StepInvestment data={formData} updateData={updateData} />}
          {currentStep === 2 && <StepWorkforce data={formData} updateData={updateData} />}
          {currentStep === 3 && <StepCSCategory data={formData} updateData={updateData} />}
          {currentStep === 4 && <StepOptional data={formData} updateData={updateData} />}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 48, paddingTop: 24, borderTop: "1px solid var(--border-secondary)" }}>
            <button
              className="btn-secondary"
              onClick={prevStep}
              disabled={currentStep === 1 || isSubmitting}
              style={{ visibility: currentStep === 1 ? "hidden" : "visible" }}
            >
              <ArrowLeft size={16} />
              Back
            </button>
            
            <button
              className="btn-primary"
              onClick={nextStep}
              disabled={!isStepValid() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />
                  Calculating...
                </>
              ) : currentStep === STEPS.length ? (
                <>
                  Calculate All Incentives
                  <ArrowRight size={16} />
                </>
              ) : (
                <>
                  Next Step
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
