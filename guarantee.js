'use strict';

const guarantee = function () {
    const actualCalls = {
        ok: 0,
        throws: 0,
        equal: 0,
    }

    const guarantee = {
        ok(actual, message) {
            actualCalls.ok++
            if (actual) {
                console.log('OK', message)
            } else {
                throw new Error(message)
            }
        },
        throws(func, message) {
            actualCalls.throws++
            try {
                func()
            } catch(_e) {
                console.log('OK', message)
                return
            }
            throw new Error(message)
        },
        equal(expected, actual, message) {
            actualCalls.equal++
            if (expected == actual) {
                console.log('OK', message)
            } else {
                throw new Error(`${message}:

    Expected: ${expected}
    Actual: ${actual}
`)
            }
        },
        calls(expectedCalls, ms) {
            if (ms) {
                setTimeout(() => guarantee.calls(expectedCalls))
            } else {
                const mismatches = Object.keys(expectedCalls).filter((key) => actualCalls[key] != expectedCalls[key])
                if (mismatches.length) {
                    throw new Error(
                        JSON.stringify(
                            mismatches.map(key =>
                                [key, {actual: actualCalls[key], expected: expectedCalls[key]}]
                            ).reduce((acc, next) => {
                                acc[next[0]] = next[1]
                                return acc
                            }, {}),
                            null,
                            2
                        )
                    )
                } else {
                    console.log('OK', 'number of calls matched')
                }
            }
        }
    }

    return guarantee
}
module.exports = guarantee
