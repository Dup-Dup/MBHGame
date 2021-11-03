const initialState = {
  questions: [],
  answers: [],
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;
  const { questions, answers } = state;

  switch (type) {
    case "EMPTY_ANSWERS": {
      return {
        ...state,
        answers: [],
      };
    }
    case "SET_QUESTIONS": {
      return {
        ...state,
        questions: payload,
      };
    }
    case "SET_ANSWER": {
      const { position, answer, selected, qID } = payload;
      const available = answers.find((item) => item.position === position);
      if (!available) {
        return {
          ...state,
          answers: [...answers, { position, answer, selected, qID }],
        };
      }
      answers.forEach((item) => {
        if (item.position === position) item.answer = answer;
      });
      return {
        ...state,
      };
    }
    default:
      return state;
  }
};

export default reducer;
