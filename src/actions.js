export const addQuestions = (questions) => ({
  type: "SET_QUESTIONS",
  payload: questions,
});

export const addAnswer = (answer) => ({
  type: "SET_ANSWER",
  payload: answer,
});

export const emptyAnswers = () => ({
  type: "EMPTY_ANSWERS",
  payload: "",
});
