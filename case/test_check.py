"""Generate the case on the fixed seed and check that every number holds.

    python3 -I -m unittest discover -s case -t case
"""

import io
import sys
import tempfile
import unittest
from contextlib import redirect_stdout
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

import check  # noqa: E402
import generate  # noqa: E402


class TheCaseHolds(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.tmp = tempfile.TemporaryDirectory()
        cls.path = Path(cls.tmp.name) / "claims.csv"
        generate.write(generate.generate(), cls.path)
        cls.report = check.run(cls.path)
        out = io.StringIO()
        with redirect_stdout(out):
            cls.exit_code = check.main([str(cls.path)])
        cls.output = out.getvalue()

    @classmethod
    def tearDownClass(cls) -> None:
        cls.tmp.cleanup()

    def test_every_check_holds(self) -> None:
        failed = [l for l in self.report.lines if l[3] == "FAIL"]
        self.assertEqual(failed, [], "\n".join(" | ".join(l) for l in failed))

    def test_check_exits_zero(self) -> None:
        self.assertEqual(self.exit_code, 0)

    def test_committed_output_is_current(self) -> None:
        committed = (HERE / "check-output.txt").read_text()
        self.assertEqual(self.output, committed,
                         "case/check-output.txt is stale: regenerate it (see case/README.md)")

    def test_sample_is_the_head_of_the_file(self) -> None:
        sample = (HERE / "claims-sample.csv").read_text().splitlines()
        head = self.path.read_text().splitlines()[: len(sample)]
        self.assertEqual(sample, head)


if __name__ == "__main__":
    unittest.main()
