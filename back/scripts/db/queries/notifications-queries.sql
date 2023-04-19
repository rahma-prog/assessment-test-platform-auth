-- Active: 1677245189387@@127.0.0.1@5432@arabius_local_dev@public

/*
 Words to review notification on specific day hour OR 
 between end user goal duration
 (This query should run hourly to duo to users time zone)
 */

SELECT
    "endUser"."name" AS "endUserName",
    "endUser"."id" AS "endUserId",
    "endUser"."fcmDeviceToken" AS "endUserFcmDeviceToken",
    "endUser"."timeZone",
    count("wordReview"."id") AS "wordsToReviewCount"
FROM "user" "endUser"
    INNER JOIN "end-user-word-review" "wordReview" ON "wordReview"."endUserId" = "endUser"."id"
    LEFT JOIN "end-user-daily-goal" "dailyGoal" ON "dailyGoal"."endUserId" = "endUser"."id" AND "dailyGoal"."numberOfLessons" > 0
    LEFT JOIN "END"
WHERE
    "endUser"."timeZone" IS NOT NULL
    AND "endUser"."fcmDeviceToken" IS NOT NULL
    AND "endUser"."deleteAccountRequestedAt" IS NULL
    AND "endUser"."disableNotifications" = false
    AND ( (
            extract(
                hour
                FROM
                    current_timestamp AT TIME ZONE "endUser"."timeZone"
            )
        ) = (
            CASE
                WHEN "dailyGoal" IS NOT NULL THEN (
                    CASE "dailyGoal"."dayPeriod"
                        WHEN 'M' THEN 8
                        WHEN 'A' THEN 13
                        WHEN 'E' THEN 18
                        ELSE 11
                    END
                )
                ELSE (11)
            END
        )
    )
    AND ( ("dailyGoal" IS NULL)
        OR ( (
                "dailyGoal"."numberOfLessons" > 0
            )
            AND ( ("dailyGoal"."weekDay") :: TEXT = to_char(
                    current_timestamp AT TIME ZONE "endUser"."timeZone",
                    'D'
                )
            )
        )
    )
    AND (
        "wordReview"."updatedAt" + (
            LEAST(
                "wordReview"."interRepetitionInterval",
                10000
            ) || 'day'
        ) :: interval
    ) :: date <= current_date
GROUP BY "endUser"."id"
HAVING
    count("wordReview"."id") >= 2;

/*
 Custom scheduled end user notification,
 this query should run hourly to send notif based on the user timezone
 */

-- Active: 1677245189387@@127.0.0.1@5432@arabius_local_dev@public

select
    "endUser"."id" "endUserId",
    "endUser"."name" "endUserName",
    eun.id "notifId",
    DATE_TRUNC(
        'hour',
        current_timestamp AT TIME ZONE "endUser"."timeZone"
    ) "currentEndUserDate",
    DATE_TRUNC('hour', eun."scheduledAt") "notifDate"
from "user" "endUser"
    INNER JOIN "end-user-notification" eun ON (
        eun."isDraft" = false AND eun."scheduledAt" IS NOT NULL AND eun."scheduledAt" <= CURRENT_DATE + INTERVAL '2 days' AND eun."scheduledAt" >= CURRENT_DATE - INTERVAL '2 days'
    )
    LEFT JOIN "end-user-lesson" eul ON eul."endUserId" = "endUser"."id"
    LEFT JOIN "lesson" currentLesson ON currentLesson."id" = eul."lessonId"
    LEFT JOIN "lesson" filterToLesson ON filterToLesson."id" = eun."filterToLessonId"
    LEFT JOIN "lesson" filterFromLesson ON filterFromLesson."id" = eun."filterFromLessonId"
WHERE
    "endUser"."timeZone" IS NOT NULL
    AND "endUser"."fcmDeviceToken" IS NOT NULL
    AND "endUser"."deleteAccountRequestedAt" IS NULL
    AND "endUser"."disableNotifications" = false
    AND (
        eun."filterCurrentRegion" IS NULL
        OR (
            "endUser"."currentRegion" :: TEXT = eun."filterCurrentRegion" :: TEXT
            AND (
                filterToLesson IS NULL
                OR (
                    currentLesson IS NOT NULL
                    AND currentLesson.order <= filterToLesson.order
                )
            )
            AND (
                filterFromLesson IS NULL
                OR (
                    currentLesson IS NOT NULL
                    AND currentLesson.order >= filterFromLesson.order
                )
            )
        )
    )
    AND (
        eun."filterGender" IS NULL
        OR "endUser"."gender" :: text = eun."filterGender" :: text
    )
    AND (
        eun."filterCreatedDateFrom" IS NULL
        OR "endUser"."createdAt" >= eun."filterCreatedDateFrom"
    )
    AND (
        eun."filterCreatedDateTo" IS NULL
        OR "endUser"."createdAt" <= eun."filterCreatedDateTo"
    )
    AND (
        eun."filterLastInteractionDateFrom" IS NULL
        OR "endUser"."updatedAt" >= eun."filterLastInteractionDateFrom"
    )
    AND (
        eun."filterLastInteractionDateTo" IS NULL
        OR "endUser"."updatedAt" <= eun."filterLastInteractionDateTo"
    )
    AND (
        DATE_TRUNC(
            'hour',
            current_timestamp AT TIME ZONE "endUser"."timeZone"
        ) = DATE_TRUNC('hour', eun."scheduledAt")
    );