export default class Quiz {
  _trueAnswersCount = 0
  _tryCount = 0
  _bestPrecent = 0
  _nowQuestionNum = 1

  _rightAudio = new Audio('/source/audio/5a74133cdb3fbcbfa129fd8f3c297efb.mp3')

  _phrases = {
    badResult: 'Не очень хороший результат, рекомендуем изучить курс еще раз.',
    greatResult: 'Хороший результат! Так держать!',
  }

  constructor(initialOptions) {
    //#region setOptions
    const defaultOptions = {
      components: {
        labelHolderId: 'page-label',
        start: {
          startContainerId: 'quiz-start-container',
          startQuizBtnId: 'quiz-start-btn',
        },
        question: {
          questionContainerId: 'quiz-question-container',
          questionHolderId: 'quiz-question',
          answersContainerId: 'quiz-answers',
          answerContainerClassName: 'quiz-answer',
          entryAnswerBtnId: 'entry-answer',
        },
        result: {
          resultContainerId: 'quiz-result-container',
          usernameHolderId: 'quiz-username',
          doneDateHolderId: 'quiz-done-date',
          resultTryNumHolderId: 'result-try-num',
          nowResultPointsHolderId: 'points',
          nowMaxPointsHolderId: 'max-points',
          resultInPrecentHolderId: 'result-in-precent',
          bestResultContainerId: 'best-result-container',
          bestResultPrecentHolderId: 'best-result-precent',
          resultCommentHolderId: 'result-comment',
          repeatTestBtnId: 'repeat-test-button',
        },
      },
      questions: [
        {
          id: 1,
          question: 'empty question, please entry questions array',
          answers: [
            {
              id: 1,
              text: 'I`m alone (',
            },
          ],
          rightQuestionId: 1,
        },
      ],
      params: {
        windowTransitionDuration: 300,
        username: 'Инкогнито',
        randomQuestionsOrder: false,
        randomAnswersOrder: false,
      },
      handlers: {
        questionEndHandler: () => {},
        testEndHandler: () => {},
      },
    }

    const options = {
      ...defaultOptions,
      components: {
        labelHolderId:
          initialOptions?.components?.labelHolderId ??
          defaultOptions.components.labelHolderId,
        start: {
          ...(initialOptions?.components?.start ??
            defaultOptions.components.start),
        },
        question: {
          ...(initialOptions?.components?.question ??
            defaultOptions.components.question),
        },
        result: {
          ...(initialOptions?.components?.result ??
            defaultOptions.components.result),
        },
      },
      questions: [...(initialOptions?.questions ?? defaultOptions.questions)],
      params: {
        windowTransitionDuration:
          initialOptions?.params?.windowTransitionDuration ??
          defaultOptions.params.windowTransitionDuration,
        username:
          initialOptions?.params?.username ?? defaultOptions.params.username,
        randomQuestionsOrder:
          initialOptions?.params?.randomQuestionsOrder ??
          defaultOptions.params.randomQuestionsOrder,
        randomAnswersOrder:
          initialOptions?.params?.randomAnswersOrder ??
          defaultOptions.params.randomAnswersOrder,
      },
      handlers: {
        questionEndHandler:
          initialOptions?.handlers?.questionEndHandler ??
          defaultOptions.handlers.questionEndHandler,
        testEndHandler:
          initialOptions?.handlers?.testEndHandler ??
          defaultOptions.handlers.testEndHandler,
      },
    }

    // sets
    const components = options.components
    const startContainer = document.getElementById(
      components.start.startContainerId
    )
    const questionContainer = document.getElementById(
      components.question.questionContainerId
    )
    const resultContainer = document.getElementById(
      components.result.resultContainerId
    )

    resultContainer.querySelector(
      '#' + components.result.usernameHolderId
    ).textContent = options.params.username

    this._questionEndHandler = options.handlers.questionEndHandler
    this._testEndHandler = options.handlers.testEndHandler
    this._randomQuestionsOrder = options.params.randomQuestionsOrder
    this._randomAnswersOrder = options.params.randomAnswersOrder
    this._questions = options.questions
    //#endregion

    this._DOM = {
      labelHolder: document.getElementById(components.labelHolderId),
      start: {
        startContainer,
        startQuizBtn: startContainer.querySelector(
          '#' + components.start.startQuizBtnId
        ),
      },
      question: {
        questionContainer,
        questionHolder: questionContainer.querySelector(
          '#' + components.question.questionHolderId
        ),
        answersContainer: questionContainer.querySelector(
          '#' + components.question.answersContainerId
        ),
        answerContainer: questionContainer.querySelector(
          '.' + components.question.answerContainerClassName
        ),
        entryAnswerBtn: questionContainer.querySelector(
          '#' + components.question.entryAnswerBtnId
        ),
      },
      result: {
        resultContainer,
        doneDateHolder: resultContainer.querySelector(
          '#' + components.result.doneDateHolderId
        ),
        resultTryNumHolder: resultContainer.querySelector(
          '#' + components.result.resultTryNumHolderId
        ),
        nowResultPointsHolder: resultContainer.querySelector(
          '#' + components.result.nowResultPointsHolderId
        ),
        nowMaxPointsHolder: resultContainer.querySelector(
          '#' + components.result.nowMaxPointsHolderId
        ),
        resultInPrecentHolder: resultContainer.querySelector(
          '#' + components.result.resultInPrecentHolderId
        ),
        bestResultContainer: resultContainer.querySelector(
          '#' + components.result.bestResultContainerId
        ),
        bestResultPrecentHolder: resultContainer.querySelector(
          '#' + components.result.bestResultPrecentHolderId
        ),
        resultCommentHolder: resultContainer.querySelector(
          '#' + components.result.resultCommentHolderId
        ),
        repeatTestBtn: resultContainer.querySelector(
          '#' + components.result.repeatTestBtnId
        ),
      },
    }

    // #region initial states
    this._DOM.start.startContainer.style.display = 'none'
    this._DOM.question.questionContainer.style.display = 'none'
    this._DOM.result.resultContainer.style.display = 'none'
    this._DOM.start.startContainer.style.transform = 'translateX(-100vw)'
    this._DOM.question.questionContainer.style.transform = 'translateX(-100vw)'
    this._DOM.result.resultContainer.style.transform = 'translateX(-100vw)'

    this._DOM.labelHolder.style.opacity = '0'
    this._DOM.labelHolder.style.transform = 'translateY(-50px)'
    //#endregion

    // #region set transitions
    this._windowTransition = options.params.windowTransitionDuration
    const transitionInSeconds = this._windowTransition / 1000
    this._DOM.start.startContainer.style.transition = `${transitionInSeconds}s transform`
    this._DOM.question.questionContainer.style.transition = `${transitionInSeconds}s transform`
    this._DOM.result.resultContainer.style.transition = `${transitionInSeconds}s transform`

    this._DOM.labelHolder.style.transition = `${transitionInSeconds / 2}s`
    //#endregion

    this._DOM.question.entryAnswerBtn.addEventListener('click', () =>
      this._endQuestion()
    )

    // initial launches
    this._setEvents()

    if (this._randomQuestionsOrder) {
      this.randomizeQuestions()
    }
    if (this._randomAnswersOrder) {
      this.randomizeAnswers()
    }

    this._openWindow(this._DOM.start.startContainer)
    this._openLabel()
  }

  // #region open/close main components of page (start, question, result)
  _closeWindow(window) {
    window.style.transform = 'translateX(100vw)'
    setTimeout(() => {
      window.style.display = 'none'
      window.style.transition = 'none'
      window.style.transform = 'translateX(-100vw)'
      setTimeout(() => {
        window.style.transition = `${this._windowTransition / 1000}s transform`
      }, 1)
    }, this._windowTransition)
  }
  _openWindow(window) {
    window.style.display = 'block'
    setTimeout(() => {
      window.style.transform = 'translateX(0vw)'
    }, 1)
  }
  //#endregion

  // #region open/close main label of page
  _openLabel() {
    const holder = this._DOM.labelHolder
    holder.style.opacity = '1'
    holder.style.transform = 'translateY(0)'
  }
  _closeLabel() {
    const holder = this._DOM.labelHolder
    holder.style.transform = 'translateY(50px)'
    holder.style.opacity = '0'
    setTimeout(() => {
      holder.style.transition = 'none'
      holder.style.transform = 'translateY(-50px)'
      holder.style.transition = `${this._windowTransition / 2000}s`
    }, this._windowTransition)
  }
  //#endregion

  // #region start question in test
  _startQuestion(qustion) {
    const questionDOM = this._DOM.question

    questionDOM.questionHolder.textContent = qustion.question
    this._DOM.labelHolder.textContent = 'Вопрос №' + this._nowQuestionNum

    // append answers
    const questionElem = questionDOM.answerContainer
    questionDOM.answersContainer.innerHTML = null
    const arrayOfAnswersElements = []
    qustion.answers.forEach((answer) => {
      const newQuestionElem = questionElem.cloneNode(true)
      const newQuestionElemLabel = newQuestionElem.querySelector('label')
      const newQuestionElemInput = newQuestionElem.querySelector('input')
      newQuestionElem.setAttribute('data-answer-id', answer.id)
      newQuestionElemLabel.textContent = answer.text
      newQuestionElemLabel.setAttribute('for', 'radio-answer-' + answer.id)
      newQuestionElemInput.id = 'radio-answer-' + answer.id
      newQuestionElemInput.addEventListener('change', () => {
        questionDOM.entryAnswerBtn.classList.remove('button--disabled')
        questionDOM.entryAnswerBtn.disabled = false
      })
      arrayOfAnswersElements.push(newQuestionElem)
    })
    questionDOM.answersContainer.append(...arrayOfAnswersElements)

    this._openLabel()
    this._openWindow(questionDOM.questionContainer)
  }
  // #endregion

  // #region end one question and may be continue...
  _endQuestion() {
    const questionDOM = this._DOM.question
    this._rightAudio.currentTime = 0
    this._rightAudio.play()

    //getting user choice
    let userChoiceId = 0
    questionDOM.answersContainer
      .querySelectorAll('[data-answer-id]')
      .forEach((answerElem) => {
        if (answerElem.querySelector('input').checked) {
          userChoiceId = +answerElem.getAttribute('data-answer-id')
        }
      })

    //check result
    if (
      userChoiceId === this._questions[this._nowQuestionNum - 1].rightQuestionId
    ) {
      this._trueAnswersCount++
    }

    // visible close
    this._closeLabel()
    this._closeWindow(questionDOM.questionContainer)

    this._questionEndHandler(this._nowQuestionNum)

    // not visible close
    setTimeout(() => {
      if (this._nowQuestionNum >= this._questions.length) {
        this._finishTest()
        return
      }
      this._nowQuestionNum++
      this._startQuestion(this._questions[this._nowQuestionNum - 1])
    }, this._windowTransition + 200)
  }
  // #endregion

  // #region End the test
  _finishTest() {
    const resultDOM = this._DOM.result

    this._tryCount++
    const nowResultPrecent =
      (this._trueAnswersCount / this._nowQuestionNum) * 100
    if (nowResultPrecent > this._bestPrecent) {
      this._bestPrecent = nowResultPrecent
    }

    // set results
    this._DOM.labelHolder.textContent = 'Результаты тестирования'
    const nowDate = new Date()
    resultDOM.doneDateHolder.textContent = `${nowDate
      .getDate()
      .toString()
      .padStart(2, 0)}.${(nowDate.getMonth() + 1)
      .toString()
      .padStart(2, 0)}.${nowDate.getFullYear()}`
    resultDOM.resultTryNumHolder.textContent = this._tryCount
    resultDOM.resultInPrecentHolder.textContent = nowResultPrecent + '%'
    resultDOM.nowResultPointsHolder.textContent = this._trueAnswersCount
    resultDOM.nowMaxPointsHolder.textContent = this._nowQuestionNum

    // not first try
    if (this._tryCount > 1) {
      resultDOM.bestResultPrecentHolder.textContent = this._bestPrecent + '%'
      resultDOM.bestResultContainer.style.display = 'flex'
    } else {
      resultDOM.bestResultContainer.style.display = 'none'
    }

    // bad/good result set
    if (nowResultPrecent >= 80) {
      //good
      resultDOM.resultCommentHolder.textContent = this._phrases.greatResult
      resultDOM.repeatTestBtn.style.display = 'none'
    } else {
      resultDOM.resultCommentHolder.textContent = this._phrases.badResult
      resultDOM.repeatTestBtn.style.display = 'flex'
    }

    this._testEndHandler()

    // visible
    this._openLabel()
    this._openWindow(resultDOM.resultContainer)
  }
  // #endregion

  //#region repeatTestBtnHadler
  _repeatTestBtnHandler() {
    this._closeLabel()
    this._closeWindow(this._DOM.result.resultContainer)

    if (this._randomQuestionsOrder) {
      this.randomizeQuestions()
    }
    if (this._randomAnswersOrder) {
      this.randomizeAnswers()
    }

    //clear data
    this._trueAnswersCount = 0
    this._nowQuestionNum = 1

    setTimeout(() => {
      this._startQuestion(this._questions[0])
    }, this._windowTransition + 200)
  }
  //#endregion

  //#region randomizes
  randomizeQuestions() {
    this._questions = this._getRandomizeArray(this._questions)
  }
  randomizeAnswers() {
    this._questions.forEach((question) => {
      const answers = this._getRandomizeArray(question.answers)
      question.answers = answers
      return question
    })
  }
  _getRandomizeArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }
  //#endregion

  // #region Первостепенное назначение событий
  _setEvents() {
    this._DOM.start.startQuizBtn.addEventListener('click', () => {
      this._closeWindow(this._DOM.start.startContainer)
      this._closeLabel()
      setTimeout(() => {
        this._startQuestion(this._questions[0])
      }, this._windowTransition + 200)
    })
    this._DOM.result.repeatTestBtn.addEventListener(
      'click',
      this._repeatTestBtnHandler.bind(this)
    )
  }
  // #endregion
}
