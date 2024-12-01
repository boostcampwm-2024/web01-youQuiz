export interface SubmitAnswerRequest {
  pinCode: string;
  sid: string;
  selectedAnswer: number[];
  submitTime: number;
}
