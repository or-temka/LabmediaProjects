import ProgressLines from './utils/ProgressLines.js'
import Quiz from './utils/Quiz.js'

const progress = new ProgressLines()

let questions = []

let maxQustions = 5

async function getQuestion(randomInt) {
  const result = await fetch(`https://quizgecko.com/api/v1/quiz/${randomInt}`)
    .then((response) => response.json())
    .catch((err) => false)
  return result
}

// getting with API
async function start() {
  const loading = document.getElementById('loading')
  loading.style.display = 'block'
  try {
    for (let i = 0; i < maxQustions; i++) {
      const randomInt = getRandomInt(10, 5000)
      let result = false
      while (!result) {
        result = await getQuestion(randomInt)
      }
      const newQuestion = {}

      const question = result.questions[0]
      if (question.answers.length > 1) {
        let rightQuestionId
        question.answers.forEach((answer) => {
          if (answer.correct) {
            rightQuestionId = answer.id
          }
        })
        newQuestion.id = question.id
        newQuestion.question = question.text
        newQuestion.answers = question.answers
        newQuestion.rightQuestionId = rightQuestionId
        questions.push(newQuestion)
      }
    }
  } catch (error) {
    questions = [
      {
        id: 1,
        question: 'Вопрос 1',
        answers: [
          {
            id: 1,
            text: 'ноу 1',
          },
          {
            id: 2,
            text: 'Я верный 2',
          },
          {
            id: 3,
            text: 'ноу 3',
          },
          {
            id: 4,
            text: 'ноу 4',
          },
        ],
        rightQuestionId: 2,
      },
      {
        id: 2,
        question: 'Вопрос 2',
        answers: [
          {
            id: 1,
            text: 'Я верный 1',
          },
          {
            id: 2,
            text: 'ноу 2',
          },
          {
            id: 3,
            text: 'ноу 3',
          },
          {
            id: 4,
            text: 'ноу 4',
          },
          {
            id: 5,
            text: 'ноу 5',
          },
          {
            id: 6,
            text: 'ноу 6',
          },
        ],
        rightQuestionId: 1,
      },
      {
        id: 3,
        question: 'Вопрос 3',
        answers: [
          {
            id: 1,
            text: 'ноу 1',
          },
          {
            id: 2,
            text: 'ноу 2',
          },
          {
            id: 3,
            text: 'ноу 3',
          },
          {
            id: 4,
            text: 'Я верный 4',
          },
        ],
        rightQuestionId: 4,
      },
      {
        id: 4,
        question: 'Вопрос 4',
        answers: [
          {
            id: 1,
            text: 'ноу 1',
          },
          {
            id: 2,
            text: 'ноу 2',
          },
          {
            id: 3,
            text: 'Я верный 3',
          },
          {
            id: 4,
            text: 'ноу 4',
          },
        ],
        rightQuestionId: 3,
      },
    ]
  }
  loading.style.display = 'none'
  const quiz = new Quiz({
    params: {
      username: 'Тёма Щегорцов',
      randomQuestionsOrder: true,
      randomAnswersOrder: true,
    },
    questions,
    handlers: {
      questionEndHandler: questionEndHandler,
      testEndHandler: testEndHandler,
    },
  })

  Window.quiz = quiz
}

start()

function questionEndHandler(nowQuestion) {
  progress.value = (nowQuestion / maxQustions) * 100
}

function testEndHandler() {
  progress.value = 0
}

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
