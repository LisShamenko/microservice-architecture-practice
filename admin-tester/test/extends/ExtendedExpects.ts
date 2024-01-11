//import moment from "moment";

// 
declare global {
    namespace jest {
        interface Matchers<R> {
            /**
             * @example
             * 
             * const state = [
             *     { type: 'START', data: 'foo' },
             *     { type: 'START', data: 'baz' },
             *     { type: 'END', data: 'foo' },
             * ];
             * expect(state).toContainObject({ type: 'START' });
             * expect(state).toContainObject({ type: 'END' });
             * expect(state).toContainObject({ data: 'foo' });
             * expect(state).not.toContainObject({ type: 'NONE' });
             * expect(state).not.toContainObject({ data: 'bar' });
             */
            toContainObject(argument: any): jest.CustomMatcherResult;
            //toBeSameMoment(expected: moment.Moment): CustomMatcherResult;
        }
    }
}

export function toContainObject(received, argument): jest.CustomMatcherResult {

    const pass = this.equals(received,
        expect.arrayContaining([
            expect.objectContaining(argument)
        ])
    )

    const pr = this.utils.printReceived(received);
    const pe = this.utils.printExpected(argument);
    if (pass) {
        return {
            message: () => (`expected ${pr} not to contain object ${pe}`),
            pass: true,
        }
    }
    else {
        return {
            message: () => (`expected ${pr} to contain object ${pe}`),
            pass: false,
        }
    }
}

// toBeSameMoment(received: moment.Moment, expected: moment.Moment): jest.CustomMatcherResult {
//     const pass: boolean = received.isSame(expected);
//     const message: () => string = () => pass ? "" : `Received moment (${received.toISOString()}) is not the same as expected (${expected.toISOString()})`;
//     return { message, pass };
// }

expect.extend({ toContainObject });
