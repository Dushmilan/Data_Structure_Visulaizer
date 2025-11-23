// python-execution.js
// Module to handle Python code execution with Skulpt
const Sk = require('skulpt');
const PythonASTInstrumenter = require('./python-ast-instrumentation');

// Create an instance of the instrumenter
const instrumenter = new PythonASTInstrumenter();

// Initialize Skulpt with custom output and error handling
function initializeSkulpt() {
    let outputText = '';

    Sk.configure({
        output: (text) => {
            outputText += text;
        },
        read: (x) => {
            if (Sk.builtinFiles === undefined || Sk.builtinFiles['files'][x] === undefined) {
                throw 'File not found: ' + x;
            }
            return Sk.builtinFiles['files'][x];
        },
        execLimit: 10000, // 10 seconds time limit
    });

    return outputText;
}

// Function to execute Python code and capture data structure states
async function executePythonCode(code) {
    try {
        // Validate the code for dangerous patterns before execution
        const dangerousPatterns = [
            /import\s+os/,
            /import\s+sys/,
            /exec\(/,
            /eval\(/,
            /__import__/,
            /subprocess/,
            /importlib/,
            /open\(/,
            /shutil/,
            /socket/,
            /requests/,
            /urllib/,
            /execfile/,
            /compile/,
            /\.system/,
            /\.popen/,
            /file\s*\(/,
            /input\(/  // In Python 3, but we'll block it anyway as it's user input
        ];

        for (const pattern of dangerousPatterns) {
            if (pattern.test(code)) {
                throw new Error(`Potentially dangerous code detected: ${pattern}`);
            }
        }

        // Use AST instrumentation to get better state tracking
        const structures = instrumenter.identifyDataStructures(code);

        // Create visualization data based on identified structures
        let visualizationData;

        if (structures.stacks.length > 0) {
            // If stack-like operations are detected, return sample stack data
            visualizationData = {
                type: "stack",
                data: [1, 2, 3, 4, 5], // Sample stack data
                step: 1,
                totalSteps: 1
            };
        } else if (structures.queues.length > 0) {
            // If queue-like operations are detected, return sample queue data
            visualizationData = {
                type: "queue",
                data: [1, 2, 3, 4, 5], // Sample queue data
                step: 1,
                totalSteps: 1
            };
        } else if (structures.arrays.length > 0) {
            visualizationData = {
                type: "array",
                data: structures.arrays[0].values, // Use first array
                step: 1,
                totalSteps: 1
            };
        } else if (structures.linkedLists.length > 0) {
            visualizationData = {
                type: "linkedlist",
                data: [
                    { value: 1, next: 1 },
                    { value: 2, next: 2 },
                    { value: 3, next: null }
                ],
                step: 1,
                totalSteps: 1
            };
        } else {
            // Default to array
            visualizationData = {
                type: "array",
                data: [1, 2, 3, 4, 5],
                step: 1,
                totalSteps: 1
            };
        }

        // For now, we'll just return the identified structures
        // In a full implementation, we'd execute instrumented code
        let outputText = initializeSkulpt();

        // Execute the code with Skulpt
        try {
            await Sk.misceval.asyncToPromise(() =>
                Sk.importMainWithBody("<stdin>", false, code, true)
            );
        } catch (execError) {
            outputText += `Execution error: ${execError.toString()}`;
            return {
                output: outputText,
                error: execError.toString(),
                visualizationData: null,
                success: false
            };
        }

        return {
            output: outputText,
            visualizationData: visualizationData,
            steps: [
                {
                    step: 1,
                    description: "Initial state",
                    visualizationData: visualizationData
                }
            ],
            success: true,
            totalSteps: 1
        };
    } catch (error) {
        return {
            output: "",
            error: error.toString(),
            visualizationData: null,
            success: false
        };
    }
}

// Function to execute one step of Python code
// This is a simplified implementation; full implementation would require
// actual step-by-step execution with state capture
async function executePythonStep(code, currentStep) {
    // Validate the code for dangerous patterns before execution
    const dangerousPatterns = [
        /import\s+os/,
        /import\s+sys/,
        /exec\(/,
        /eval\(/,
        /__import__/,
        /subprocess/,
        /importlib/,
        /open\(/,
        /shutil/,
        /socket/,
        /requests/,
        /urllib/,
        /execfile/,
        /compile/,
        /\.system/,
        /\.popen/,
        /file\s*\(/,
        /input\(/
    ];

    for (const pattern of dangerousPatterns) {
        if (pattern.test(code)) {
            throw new Error(`Potentially dangerous code detected: ${pattern}`);
        }
    }

    // Use the instrumenter to identify structures
    const structures = instrumenter.identifyDataStructures(code);

    let visualizationData;

    if (structures.stacks.length > 0) {
        // If stack-like operations are detected, return sample stack data
        visualizationData = {
            type: "stack",
            data: [1, 2, 3, 4, 5], // Sample stack data
            step: currentStep + 1,
            totalSteps: 5
        };
    } else if (structures.queues.length > 0) {
        // If queue-like operations are detected, return sample queue data
        visualizationData = {
            type: "queue",
            data: [1, 2, 3, 4, 5], // Sample queue data
            step: currentStep + 1,
            totalSteps: 5
        };
    } else if (structures.arrays.length > 0) {
        visualizationData = {
            type: "array",
            data: structures.arrays[0].values,
            step: currentStep + 1,
            totalSteps: 5
        };
    } else if (structures.linkedLists.length > 0) {
        visualizationData = {
            type: "linkedlist",
            data: [
                { value: 1, next: 1 },
                { value: 2, next: 2 },
                { value: 3, next: null }
            ],
            step: currentStep + 1,
            totalSteps: 5
        };
    } else {
        visualizationData = {
            type: "array",
            data: [1, 2, 3, 4, 5],
            step: currentStep + 1,
            totalSteps: 5
        };
    }

    return {
        output: `Step ${currentStep + 1} executed`,
        visualizationData: visualizationData,
        success: true,
        currentStep: currentStep + 1,
        totalSteps: 5
    };
}

module.exports = {
    executePythonCode,
    executePythonStep
};