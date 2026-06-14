import { ref, computed } from 'vue'

export const useGameEngine = (missionId: number) => {
  const { fireConfetti } = useConfetti()
  const { saveMissionResult } = useMissionProgress()

  const currentQuestionIndex = ref(0)
  const totalQuestions = 5
  const correctAnswers = ref(0)
  const startTime = ref(Date.now())
  
  const question = ref<any>(null)
  const options = ref<any[]>([])
  
  const isFinished = ref(false)
  const showSuccessOverlay = ref(false)
  const shakeButtonIndex = ref<number | null>(null)

  const generateOptions = (correct: number, count = 3) => {
    const opts = new Set<number>()
    opts.add(correct)
    while (opts.size < count) {
      let rand = correct + Math.floor(Math.random() * 7) - 3 // +/- 3
      if (rand < 0) rand = Math.abs(rand) // Ensure no negative numbers
      // Prevent 0 if correct answer isn't 0, just to be safe
      if (rand === 0 && correct !== 0) rand = 1
      opts.add(rand)
    }
    // Shuffle
    return Array.from(opts).sort(() => Math.random() - 0.5)
  }

  const generateQuestion = () => {
    const prevQ = question.value ? JSON.stringify(question.value) : null
    let newQ: any = null
    let newOpts: any[] = []

    do {
      if (missionId === 1) { // Counting
        const n = Math.floor(Math.random() * 10) + 1
        newQ = { count: n }
        newOpts = generateOptions(n, 3)
      } 
      else if (missionId === 2) { // Addition
        const a = Math.floor(Math.random() * 9) + 1
        const b = Math.floor(Math.random() * (10 - a)) + 1 // a+b <= 10
        newQ = { left: a, right: b, operator: '+', answer: a + b }
        newOpts = generateOptions(a + b, 4)
      }
      else if (missionId === 3) { // Subtraction
        // Ensure no negative answers by making total (a) >= eaten (b)
        const a = Math.floor(Math.random() * 10) + 1
        const b = Math.floor(Math.random() * a) + 1 
        newQ = { total: a, eaten: b, answer: a - b }
        newOpts = generateOptions(a - b, 3)
      }
      else if (missionId === 4) { // Comparison
        let a = Math.floor(Math.random() * 10) + 1
        let b = Math.floor(Math.random() * 10) + 1
        while (a === b) {
          b = Math.floor(Math.random() * 10) + 1
        }
        newQ = { left: a, right: b, answer: a > b ? 'Kiri' : 'Kanan' }
        newOpts = ['Kiri', 'Kanan']
      }
    } while (prevQ && JSON.stringify(newQ) === prevQ)

    question.value = newQ
    options.value = newOpts
  }

  const checkAnswer = (answer: any, optionIndex: number) => {
    const expected = question.value.answer !== undefined ? question.value.answer : question.value.count
    const isCorrect = answer === expected

    if (isCorrect) {
      correctAnswers.value++
      fireConfetti()
      
      if (currentQuestionIndex.value < totalQuestions - 1) {
        showSuccessOverlay.value = true
        setTimeout(() => {
          showSuccessOverlay.value = false
          currentQuestionIndex.value++
          generateQuestion()
        }, 1500)
      } else {
        finishGame()
      }
    } else {
      // Shake
      shakeButtonIndex.value = optionIndex
      setTimeout(() => { shakeButtonIndex.value = null }, 500)
    }
  }

  const finishGame = async () => {
    isFinished.value = true
    showSuccessOverlay.value = false
    const timeSpent = Math.floor((Date.now() - startTime.value) / 1000)
    await saveMissionResult(missionId, correctAnswers.value, timeSpent)
  }

  const resetGame = () => {
    currentQuestionIndex.value = 0
    correctAnswers.value = 0
    startTime.value = Date.now()
    isFinished.value = false
    showSuccessOverlay.value = false
    generateQuestion()
  }

  const progressPercentage = computed(() => {
    return (currentQuestionIndex.value / totalQuestions) * 100
  })

  // Init first question
  generateQuestion()

  return {
    currentQuestionIndex,
    totalQuestions,
    correctAnswers,
    question,
    options,
    isFinished,
    showSuccessOverlay,
    shakeButtonIndex,
    progressPercentage,
    checkAnswer,
    resetGame
  }
}
