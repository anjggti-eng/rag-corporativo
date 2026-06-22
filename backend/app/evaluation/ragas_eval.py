from dataclasses import dataclass

from datasets import Dataset
from loguru import logger

try:
    from ragas import evaluate
    from ragas.metrics import faithfulness, answer_relevancy, context_precision

    RAGAS_AVAILABLE = True
except ImportError:
    RAGAS_AVAILABLE = False
    logger.warning("Ragas not installed. Evaluation will use fallback.")


@dataclass
class EvalResult:
    faithfulness: float
    answer_relevancy: float
    context_precision: float
    passed: bool
    details: str = ""


class RAGASEvaluator:
    FAITHFULNESS_THRESHOLD = 0.8
    RELEVANCY_THRESHOLD = 0.7
    PRECISION_THRESHOLD = 0.7

    def evaluate(
        self,
        question: str,
        answer: str,
        contexts: list[str],
        ground_truth: str = "",
    ) -> EvalResult:
        if not RAGAS_AVAILABLE:
            return EvalResult(
                faithfulness=0.0,
                answer_relevancy=0.0,
                context_precision=0.0,
                passed=False,
                details="Ragas not installed",
            )

        data_samples = {
            "question": [question],
            "answer": [answer],
            "contexts": [contexts],
            "ground_truth": [ground_truth] if ground_truth else [""],
        }
        dataset = Dataset.from_dict(data_samples)

        try:
            metrics = [faithfulness, answer_relevancy]
            if ground_truth:
                metrics.append(context_precision)

            scores = evaluate(dataset=dataset, metrics=metrics)

            faith_score = float(scores["faithfulness"])
            relevancy_score = float(scores["answer_relevancy"])
            precision_score = (
                float(scores["context_precision"]) if ground_truth else 0.0
            )

            passed = (
                faith_score >= self.FAITHFULNESS_THRESHOLD
                and relevancy_score >= self.RELEVANCY_THRESHOLD
            )

            return EvalResult(
                faithfulness=faith_score,
                answer_relevancy=relevancy_score,
                context_precision=precision_score,
                passed=passed,
                details=self._format_details(faith_score, relevancy_score, precision_score),
            )
        except Exception as e:
            logger.error(f"Ragas evaluation failed: {e}")
            return EvalResult(
                faithfulness=0.0,
                answer_relevancy=0.0,
                context_precision=0.0,
                passed=False,
                details=f"Error: {str(e)}",
            )

    def _format_details(
        self, faith: float, relevancy: float, precision: float
    ) -> str:
        status = "PASS" if faith >= self.FAITHFULNESS_THRESHOLD else "FAIL"
        rel_status = "PASS" if relevancy >= self.RELEVANCY_THRESHOLD else "FAIL"

        return (
            f"Faithfulness: {faith:.3f} [{status}] (threshold: {self.FAITHFULNESS_THRESHOLD})\n"
            f"Answer Relevancy: {relevancy:.3f} [{rel_status}] (threshold: {self.RELEVANCY_THRESHOLD})\n"
            f"Context Precision: {precision:.3f}"
        )
