// src/lib/questions.js

export const QUESTIONS = [
  {
    key: "Gender",
    type: "choice",
    prompt: "Let's get started 🌱 — what's your gender?",
    options: ["Female", "Male"],
  },
  {
    key: "Age",
    type: "number",
    prompt: "How old are you? (Just the number is fine — e.g. 21)",
    validate: (raw) => {
      const n = Number(raw);
      if (raw === "" || Number.isNaN(n))
        return { error: "I didn't catch a number there — could you type your age as digits? (e.g. 21)" };
      if (n < 15 || n > 80)
        return {
          error: `Hmm, ${n} doesn't look right for a student. Could you double-check? The range we accept is 15–80.`,
        };
      return { value: n };
    },
  },
  {
    key: "Family_background",
    type: "choice",
    prompt: "How would you describe your family's economic background?",
    options: ["Lower Middle class", "Middle class", "Rich class"],
    optionLabels: {
      "Lower Middle class": "Lower middle class",
      "Middle class": "Middle class",
      "Rich class": "Higher income / rich class",
    },
  },
  {
    key: "Relationship_status",
    type: "choice",
    prompt: "Are you currently in a relationship?",
    options: ["Single", "In a Relationship", "Complicated"],
  },
  {
    key: "Marital_status",
    type: "choice",
    prompt: "And your marital status?",
    options: ["Unmarried", "Married", "Separated"],
  },
  {
    key: "Living_style",
    type: "choice",
    prompt: "Where are you living right now?",
    options: ["Family", "Bachelor"],
    optionLabels: {
      Family: "With family",
      Bachelor: "Bachelor / hostel / shared apartment",
    },
  },
  {
    key: "Current_semester",
    type: "number",
    prompt: "Which semester are you currently in?",
    validate: (raw) => {
      const n = Number(raw);
      if (raw === "" || Number.isNaN(n) || !Number.isInteger(n))
        return { error: "That should be a whole number — which semester number are you in? (e.g. 6)" };
      if (n < 1 || n > 20)
        return { error: `Semester ${n} isn't a valid term. Please enter a number between 1 and 20.` };
      return { value: n };
    },
  },
  {
    key: "CGPA",
    type: "number",
    prompt: "What's your current CGPA (on a 4.00 scale)?",
    validate: (raw) => {
      const n = Number(raw);
      if (raw === "" || Number.isNaN(n))
        return { error: "I need a number for CGPA. Try something like 3.45." };
      if (n < 0 || n > 4)
        return {
          error: `A CGPA of ${n} is out of range — it should be between 0.00 and 4.00. Could you re-enter it?`,
        };
      return { value: n };
    },
  },
  {
    key: "friend_circle",
    type: "choice",
    prompt: "Do you have a close circle of supportive friends?",
    options: ["Yes", "No"],
    optionLabels: {
      Yes: "Yes, I have close supportive friends",
      No: "No, I don't have close peer support",
    },
  },
  {
    key: "Cost_without_study",
    type: "number",
    prompt:
      "Last one — roughly how much do you spend per month on living & personal expenses (excluding tuition)?",
    validate: (raw) => {
      const n = Number(raw);
      if (raw === "" || Number.isNaN(n))
        return { error: "A rough number is fine — e.g. 5000." };
      if (n < 0) return { error: "Cost can't be negative. Try again with a positive value." };
      return { value: n };
    },
  },
];