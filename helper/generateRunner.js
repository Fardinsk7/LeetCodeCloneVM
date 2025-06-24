"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePythonRunner = void 0;
const generatePythonRunner = ({ testCases, timeOut }) => {
    const testCasesCode = testCases.map((testCase, index) => {
        return `(${JSON.stringify(testCase.input)}, ${JSON.stringify(testCase.expectedOutput)} )`;
    }).join(',\n');
    return `import subprocess
import json

test_cases = [
    ${testCasesCode}
]

results = []

for i, (test_input, expected_output) in enumerate(test_cases):
    try:
        result = subprocess.run(
            ["python", "solution.py"],
            input=test_input,
            text=True,
            capture_output=True,
            timeout=2
        )

        output = result.stdout.strip()
        error = result.stderr.strip()

        if error:
            results.append({
                "input": test_input,
                "expected_output": expected_output.strip(),
                "got_output": "Error",
                "error": error
            })
            print(json.dumps({
                "success": False,
                "error": error,
                "result": results
            }))
            exit(0)  # ✅ important

        results.append({
            "input": test_input,
            "expected_output": expected_output.strip(),
            "got_output": output
        })

        if output != expected_output.strip():
            print(json.dumps({
                "success": False,
                "error": f"Test case {i} failed. Expected '{expected_output.strip()}', got '{output}'",
                "result": results
            }))
            exit(0)

    except subprocess.TimeoutExpired:
        results.append({
            "input": test_input,
            "expected_output": expected_output.strip(),
            "got_output": "Timeout"
        })
        print(json.dumps({
            "success": False,
            "error": f"Test case {i} timed out.",
            "result": results
        }))
        exit(0)

    except Exception as e:
        results.append({
            "input": test_input,
            "expected_output": expected_output.strip(),
            "got_output": "Exception",
            "error": str(e)
        })
        print(json.dumps({
            "success": False,
            "error": str(e),
            "result": results
        }))
        exit(0)

# ✅ All test cases passed
print(json.dumps({
    "success": True,
    "result": results
}))`;
};
exports.generatePythonRunner = generatePythonRunner;
