import React, { useReducer, useEffect, useCallback, useRef } from "react";
import "./App.css";

const defaultState = {
    result: 0,
    calcuating: false,
    operation: "",
    savedValue: 0,
    error: false,
    clear: "AC",
};

const calculate = (operator, val1, val2) => {
    let result = 0;
    switch (operator) {
        case "add":
            result = parseFloat(val1) + parseFloat(val2);
            break;
        case "subtract":
            result = parseFloat(val1) - parseFloat(val2);
            break;
        case "multiply":
            result = parseFloat(val1) * parseFloat(val2);
            break;
        case "divide":
            result = parseFloat(val1) / parseFloat(val2);
            break;
        default:
            return result.toString();
    }
    return result.toString();
};

const calculatorReducer = (state, action) => {
    switch (action.type) {
        case "operation":
            if (!state.calcuating) {
                return { ...state, operation: action.id, calcuating: true, savedVal: state.result, result: 0 };
            }
            return { ...state, operation: action.id, savedVal: calculate(state.operation, state.savedVal, state.result), result: 0 };
        case "equals":
            return {
                ...state,
                operation: "",
                calcuating: false,
                savedVal: 0,
                result: calculate(state.operation, state.savedVal, state.result),
            };
        case "reset":
            return defaultState;
        case "number":
            return { ...state, clear: "C", result: state.result ? `${state.result}${action.id}` : action.id };
        case "absolute":
            return { ...state, result: state.result[0] === "-" ? state.result.slice(1) : `-${state.result}` };
        case "decimal":
            if (state.result && state.result.includes(".")) return { ...state, error: true };
            return { ...state, result: state.result ? `${state.result}.` : "0." };
        case "removeError":
            return { ...state, error: false };
        case "percent":
            return { ...state, result: parseFloat(state.result) / 100 };
        default:
            return state;
    }
};

function App() {
    const [state, dispatch] = useReducer(calculatorReducer, defaultState);

    const zeroRef = useRef(null);
    const oneRef = useRef(null);
    const twoRef = useRef(null);
    const threeRef = useRef(null);
    const fourRef = useRef(null);
    const fiveRef = useRef(null);
    const sixRef = useRef(null);
    const sevenRef = useRef(null);
    const eightRef = useRef(null);
    const nineRef = useRef(null);
    const clearRef = useRef(null);
    const percentRef = useRef(null);
    const divideRef = useRef(null);
    const multiplyRef = useRef(null);
    const addRef = useRef(null);
    const subtractRef = useRef(null);
    const equalsRef = useRef(null);
    const decimalRef = useRef(null);

    const handleRefKeyPresses = (ref, operation = false) => {
        ref.current.className = ref.current.className + " keyboardPress";
        ref.current.click();
        setTimeout(() => {
            ref.current.className = `calc-buttons-${operation ? "operation" : "square"}`;
        }, 450);
    };

    const keyHandler = useCallback(({ keyCode, shiftKey }) => {
        const keys = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 187, 190, 13, 189, 191, 27];
        if (keys.includes(keyCode)) {
            switch (keyCode) {
                case 48:
                    if (!shiftKey) {
                        return handleRefKeyPresses(zeroRef);
                    }
                    break;
                case 49:
                    if (!shiftKey) {
                        return handleRefKeyPresses(oneRef);
                    }
                    break;
                case 50:
                    if (!shiftKey) return handleRefKeyPresses(twoRef);
                    break;
                case 51:
                    if (!shiftKey) return handleRefKeyPresses(threeRef);
                    break;
                case 52:
                    if (!shiftKey) return handleRefKeyPresses(fourRef);
                    break;
                case 53:
                    if (shiftKey) return handleRefKeyPresses(percentRef);
                    else return handleRefKeyPresses(fiveRef);
                case 54:
                    if (!shiftKey) return handleRefKeyPresses(sixRef);
                    break;
                case 55:
                    if (!shiftKey) return handleRefKeyPresses(sevenRef);
                    break;
                case 56:
                    if (shiftKey) return handleRefKeyPresses(multiplyRef, true);
                    else return handleRefKeyPresses(eightRef);
                case 57:
                    if (!shiftKey) return handleRefKeyPresses(nineRef);
                    break;
                case 190:
                    if (!shiftKey) return handleRefKeyPresses(decimalRef);
                    break;
                case 187:
                    if (shiftKey) return handleRefKeyPresses(addRef, true);
                    else return handleRefKeyPresses(equalsRef);
                case 13:
                    return dispatch({ type: "equals" });
                case 189:
                    if (!shiftKey) return handleRefKeyPresses(subtractRef, true);
                    break;
                case 191:
                    if (!shiftKey) return handleRefKeyPresses(divideRef, true);
                    break;
                case 27:
                    return handleRefKeyPresses(clearRef);
                default:
                    return;
            }
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    }, [keyHandler]);

    const { result, savedVal, error, clear } = state;

    const onDecimalClick = () => {
        dispatch({ type: "decimal" });
        setTimeout(() => {
            dispatch({ type: "removeError" });
        }, 500);
    };

    return (
        <>
            {error && <audio src={process.env.PUBLIC_URL + "/Funk.m4a"} autoPlay />}
            <div id="l-main">
                <div className="calc">
                    <div className="calc-display">
                        <div className="content">{result || savedVal || 0}</div>
                    </div>
                    <div className="calc-buttons">
                        <button
                            id="clear-button"
                            ref={clearRef}
                            className="calc-buttons-square"
                            onClick={() => dispatch({ type: "reset" })}
                        >
                            {clear}
                        </button>
                        <button id="change-sign-button" onClick={() => dispatch({ type: "absolute" })}>
                            <sup id="change-sign-button-plus">+</sup>⁄<sub id="change-sign-button-minus">-</sub>
                        </button>
                        <button id="percent-button" onClick={() => dispatch({ type: "percent" })} ref={percentRef}>
                            %
                        </button>
                        <button
                            id="divide-button"
                            className="calc-buttons-operation"
                            onClick={() => dispatch({ type: "operation", id: "divide" })}
                            ref={divideRef}
                        >
                            ÷
                        </button>

                        <button
                            id="seven-button"
                            className="calc-buttons-square"
                            data-value="7"
                            onClick={() => dispatch({ type: "number", id: "7" })}
                            ref={sevenRef}
                        >
                            7
                        </button>
                        <button id="eight-button" data-value="8" onClick={() => dispatch({ type: "number", id: "8" })} ref={eightRef}>
                            8
                        </button>
                        <button id="nine-button" data-value="9" onClick={() => dispatch({ type: "number", id: "9" })} ref={nineRef}>
                            9
                        </button>
                        <button
                            id="multiply-button"
                            className="calc-buttons-operation"
                            onClick={() => dispatch({ type: "operation", id: "multiply" })}
                            ref={multiplyRef}
                        >
                            ×
                        </button>

                        <button
                            id="four-button"
                            className="calc-buttons-square"
                            data-value="4"
                            onClick={() => dispatch({ type: "number", id: "4" })}
                            ref={fourRef}
                        >
                            4
                        </button>
                        <button id="five-button" data-value="5" onClick={() => dispatch({ type: "number", id: "5" })} ref={fiveRef}>
                            5
                        </button>
                        <button id="six-button" data-value="6" onClick={() => dispatch({ type: "number", id: "6" })} ref={sixRef}>
                            6
                        </button>
                        <button
                            id="subtract-button"
                            className="calc-buttons-operation"
                            onClick={() => dispatch({ type: "operation", id: "subtract" })}
                            ref={subtractRef}
                        >
                            -
                        </button>

                        <button
                            id="one-button"
                            className="calc-buttons-square"
                            data-value="1"
                            onClick={() => dispatch({ type: "number", id: "1" })}
                            ref={oneRef}
                        >
                            1
                        </button>
                        <button id="two-button" data-value="2" onClick={() => dispatch({ type: "number", id: "2" })} ref={twoRef}>
                            2
                        </button>
                        <button id="three-button" data-value="3" onClick={() => dispatch({ type: "number", id: "3" })} ref={threeRef}>
                            3
                        </button>
                        <button
                            id="add-button"
                            className="calc-buttons-operation"
                            onClick={() => dispatch({ type: "operation", id: "add" })}
                            ref={addRef}
                        >
                            +
                        </button>

                        <button id="zero-button" data-value="0" onClick={() => dispatch({ type: "number", id: "0" })} ref={zeroRef}>
                            0
                        </button>
                        <button id="decimal-button" className="calc-buttons-square" onClick={() => onDecimalClick()} ref={decimalRef}>
                            .
                        </button>
                        <button id="equals-button" onClick={() => dispatch({ type: "equals" })} ref={equalsRef}>
                            =
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
