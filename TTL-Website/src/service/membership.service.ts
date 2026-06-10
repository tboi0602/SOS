import { request, uploadFiles } from "./client"

export interface QuizExamSetQuestion {
  id: string
  questionId: string
  orderIndex: number
  question: QuizQuestionDef
}

export interface QuizExamSetDef {
  id: string
  name: string
  passScore: number
  questions: QuizExamSetQuestion[]
}

export interface MembershipSettings {
  flow: { id: string; name: string; price: number; rules: string | null }
  lessons: LessonDef[]
  quizQuestions: QuizQuestionDef[]
  examSets: QuizExamSetDef[]
  situationQuestions: SituationQuestionDef[]
}

export interface LessonDef {
  id: string
  title: string
  description: string | null
  type: string
  orderIndex: number
  content: string | null
}

export interface QuizQuestionDef {
  id: string
  question: string
  options: Record<string, string>
  correctAnswer: string
}

export interface SituationQuestionDef {
  id: string
  title: string
  description: string
}

export interface UserFlow {
  id: string
  userId: string
  membershipFlowId: string
  status: string
  documentsUrl: string | null
  adminNote: string | null
  paymentConfirmedAt: string | null
  paymentVerifiedAt: string | null
  quizId: string | null
  quizScore: number | null
  quizAttempts: number
  quizPassed: boolean | null
  situation1Id: string | null
  situation1Link: string | null
  situation1Score: number | null
  situation2Id: string | null
  situation2Link: string | null
  situation2Score: number | null
  totalScore: number | null
  completedAt: string | null
  membershipFlow: { id: string; name: string; price: number; rules: string | null }
}

export interface UserLesson {
  id: string
  lessonDefId: string
  title: string
  description: string | null
  type: string
  orderIndex: number
  content: string | null
  userLesson: {
    id: string
    status: string
    productUrl: string | null
    score: number | null
    adminNote: string | null
    submittedAt: string | null
  } | null
}

export interface QuizQuestion {
  id: string
  question: string
  options: { key: string; value: string }[]
}

export interface QuizData {
  examSetId: string
  examSetName: string
  passScore: number
  questions: QuizQuestion[]
  total: number
}

export interface SituationData {
  situations: {
    id: string
    title: string
    description: string
    index: number
    link: string | null
    score: number | null
  }[]
}

export const membershipService = {
  getMyFlow() {
    return request<UserFlow>("/api/v1/membership/my-flow")
  },

  uploadDocs(files: File[]) {
    return uploadFiles("/api/v1/membership/upload-docs", files, "files")
  },

  confirmPayment() {
    return request<{ message: string }>("/api/v1/membership/confirm-payment", { method: "POST" })
  },

  getLessons() {
    return request<{ lessons: UserLesson[] }>("/api/v1/membership/lessons")
  },

  submitLesson(lessonId: string, productUrl: string) {
    return request(`/api/v1/membership/lessons/${lessonId}/submit`, {
      method: "POST",
      body: { productUrl },
    })
  },

  getQuiz() {
    return request<QuizData>("/api/v1/membership/quiz")
  },

  submitQuiz(answers: Record<string, string>) {
    return request<{ passed: boolean; correctCount: number; total: number; passScore: number }>(
      "/api/v1/membership/quiz/submit",
      { method: "POST", body: { answers } },
    )
  },

  getSituations() {
    return request<SituationData>("/api/v1/membership/situations")
  },

  submitSituation(index: number, driveLink: string) {
    return request(`/api/v1/membership/situations/${index}/submit`, {
      method: "POST",
      body: { driveLink },
    })
  },
}
