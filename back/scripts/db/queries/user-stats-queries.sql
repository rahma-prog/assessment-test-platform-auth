/*
 End user completed lesson weekly progress
 */

SELECT
    DATE_TRUNC('week', eul."createdAt") "weekDayDate",
    count(eul.id) "totalWeekLessons",
FROM "end-user-lesson" eul
WHERE
    eul."endUserId" = 2
    AND eul."createdAt" >= DATE_TRUNC('week', CURRENT_DATE) - INTERVAL '1 week'
    AND eul."createdAt" <= DATE_TRUNC('week', CURRENT_DATE)
GROUP BY "weekDayDate";

/*
 End user daily goal completed lessons progress, (Only competed lessons since last goal update)
 */

SELECT
    max(eudg."updatedAt") "latestGoalUpdate"
FROM
    "end-user-daily-goal" eudg
WHERE eudg."endUserId" = 2;

SELECT
    DATE_TRUNC('week', eul."createdAt") "weekDayDate",
    count(eul.id) "totalWeekLessons"
FROM "end-user-lesson" eul
WHERE
    eul."endUserId" = 2
    AND eul."createdAt" >= DATE_TRUNC('week', TIMESTAMP '2023-02-28')
    AND eul."createdAt" <= DATE_TRUNC('week', TIMESTAMP '2023-02-28') + INTERVAL '1 week'
GROUP BY "weekDayDate";

SELECT DATE_TRUNC('week', CURRENT_DATE);

/*
 Last end user completed lesson
 */

SELECT MAX(l."order")
FROM "end-user-lesson" eul
    INNER JOIN "lesson" l ON l.id = eul."lessonId" AND l."region" = '0'
WHERE eul."endUserId" = 5;