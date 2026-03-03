import { useState } from "react";

const questions = [
  {
    question: "How does your skin feel after washing?",
    options: [
      { text: "Tight and dry", type: "Dry" },
      { text: "Comfortable", type: "Normal" },
      { text: "Oily or shiny", type: "Oily" },
      { text: "Oily in T-zone, dry elsewhere", type: "Combination" }
    ]
  },
  {
    question: "How often does your skin feel oily?",
    options: [
      { text: "Rarely", type: "Dry" },
      { text: "Sometimes", type: "Normal" },
      { text: "Very often", type: "Oily" },
      { text: "Only on forehead & nose", type: "Combination" }
    ]
  },
  {
    question: "How does your skin react to new products?",
    options: [
      { text: "Gets irritated easily", type: "Sensitive" },
      { text: "No reaction", type: "Normal" },
      { text: "Breaks out", type: "Oily" },
      { text: "Dry in some areas", type: "Combination" }
    ]
  },
  {
    question: "How visible are your pores?",
    options: [
      { text: "Very small", type: "Dry" },
      { text: "Normal", type: "Normal" },
      { text: "Large and noticeable", type: "Oily" },
      { text: "Large in T-zone, small elsewhere", type: "Combination" }
    ]
  },
  {
    question: "How sensitive is your skin to sunlight?",
    options: [
      { text: "Very sensitive", type: "Sensitive" },
      { text: "Normal", type: "Normal" },
      { text: "Rarely burns", type: "Oily" },
      { text: "Sensitive in some areas", type: "Combination" }
    ]
  },
  {
    question: "How often do you get dry patches?",
    options: [
      { text: "Often", type: "Dry" },
      { text: "Rarely", type: "Normal" },
      { text: "Never", type: "Oily" },
      { text: "Sometimes", type: "Combination" }
    ]
  },
  {
    question: "How shiny does your skin get during the day?",
    options: [
      { text: "Not at all", type: "Dry" },
      { text: "Slightly", type: "Normal" },
      { text: "Very shiny", type: "Oily" },
      { text: "Shiny in T-zone only", type: "Combination" }
    ]
  },
  {
    question: "How often do you experience acne or breakouts?",
    options: [
      { text: "Rarely", type: "Dry" },
      { text: "Occasionally", type: "Normal" },
      { text: "Frequently", type: "Oily" },
      { text: "Only on T-zone", type: "Combination" }
    ]
  },
  {
    question: "How easily does your skin become red or irritated?",
    options: [
      { text: "Very easily", type: "Sensitive" },
      { text: "Rarely", type: "Normal" },
      { text: "Sometimes", type: "Oily" },
      { text: "Only in some areas", type: "Combination" }
    ]
  },
  {
    question: "How hydrated does your skin feel at the end of the day?",
    options: [
      { text: "Very dry", type: "Dry" },
      { text: "Comfortable", type: "Normal" },
      { text: "Oily", type: "Oily" },
      { text: "Dry in some areas, oily in others", type: "Combination" }
    ]
  }
];

export default function SkinTypeQuiz() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState("");

  const handleAnswer = (type) => {
    setAnswers({
      ...answers,
      [type]: (answers[type] || 0) + 1
    });

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      calculateResult({
        ...answers,
        [type]: (answers[type] || 0) + 1
      });
    }
  };

  const calculateResult = (finalAnswers) => {
    const skinType = Object.keys(finalAnswers).reduce((a, b) =>
      finalAnswers[a] > finalAnswers[b] ? a : b
    );
    setResult(skinType);
  };

  const restartQuiz = () => {
    setCurrent(0);
    setAnswers({});
    setResult("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 p-6">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-pink-600">
          Skin Type Quiz
        </h1>

        {!result ? (
          <>
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold">
                {questions[current].question}
              </h2>
              <p className="text-gray-500 mt-2">
                Question {current + 1} of {questions.length}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {questions[current].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.type)}
                  className="w-full border border-pink-500 text-pink-600 py-3 rounded-lg hover:bg-pink-500 hover:text-white transition font-medium"
                >
                  {option.text}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center">
            <p className="text-2xl font-semibold mb-4">
              Your Skin Type is:
            </p>
            <p className="text-4xl font-bold text-pink-600 mb-6">
              {result}
            </p>
            <button
              onClick={restartQuiz}
              className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 text-lg font-medium"
            >
              Retake Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


