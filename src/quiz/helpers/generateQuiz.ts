import { Word } from 'src/words/entities/word.entity';
import { Answer, QuizItem } from '../entities/quiz.entity';

export const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

export const shuffleArray = <T>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

// export const onGenerateQuiz = (words: Word[], config: TConfiguringForm) => {
//   let configuring = words;

//   const test: QuizItem[] = configuring.map((word) => {
//     const correctTranslation = getRandomElement(word.translations);

//     const otherWords = words.filter((w) => w._id !== word._id && w.translations.length > 0);

//     const incorrectTranslations = shuffleArray(otherWords)
//       .slice(0, 3)
//       .map((w) => getRandomElement(w.translations));

//     const answers: Answer[] = shuffleArray([
//       {
//         _id: uuid.v4().toString(),
//         questionId: word._id,
//         text: correctTranslation,
//         isCorrect: true,
//       },
//       ...incorrectTranslations.map((text) => ({
//         _id: uuid.v4().toString(),
//         questionId: word._id,
//         text,
//         isCorrect: false,
//       })),
//     ]);

//     return {
//       _id: word._id,
//       word: word.word,
//       answers,
//       flag: word.flag,
//       type: word.type,
//     };
//   });

//   console.log('test =>', test);

//   const finallyFest = shuffleArray(test);

//   // dispatch(testsActions.setState({ test: finallyFest }))
//   // dispatch(testsActions.setState({ testAnswers: [] }))

//   return finallyFest;
// };
