import * as winston from 'winston';
import moment = require('moment');

//
export const logFormat = winston.format.printf(
    ({
        level,
        message,
        timestamp,
        durationMs,
        err,
        member_id,
        domain,
        payload,
    }) => {
        let log =
            `\n[${level}] ${moment(timestamp)
                .utcOffset(3)
                .format('YYYY-MM-DD HH:mm:ss')}\n${message}` +
            `\nmember_id: ${member_id}` +
            `\ndomain: ${domain}` +
            `${durationMs ? '\nDuration: ' + durationMs / 1000 + 's' : ''}` +
            `${err ? '\n' + JSON.stringify(err) : ''}`;

        if (payload && typeof payload === 'object') {
            Object.keys(payload).forEach((key) => {
                log += `\n${key}: ${JSON.stringify(payload[key])}`;
            });
        }

        return log;
    },
);
