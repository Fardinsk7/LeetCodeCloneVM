import subprocess

test_cases = [
    ("2\n3", "5\n" ),
("5\n10", "15\n" ),
("7\n8", "15\n" )
]

for i, (test_input, expected_output) in enumerate(test_cases):
    print(i)
    try:
        result = subprocess.run(
            ["python","solution.py"],
            input=test_input,
            text=True,
            capture_output=True,
            timeout=2
        )

        output = result.stdout.strip()
        print(f"This is output {output}")
        if output.strip() != expected_output.strip():
            print(f"Test Case {i} Failed: Expected '{expected_output}', Got '{output}'")
            exit(1)
        else:
            print(f"Test Case {i} Passed")
    except subprocess.TimeoutExpired:
        print(f"Test Case {i} Timeout")
        exit(1)
    except Exception as e:
        print(f"Test case {i} Error: {e}")
        exit(1)