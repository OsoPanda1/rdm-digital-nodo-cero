export class FeedbackLoop {
  adjustModel(score: number) {
    if (score < 3) {
      return "penalize_strategy";
    }

    return "reinforce_strategy";
  }
}
