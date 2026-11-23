# Kivloo analytics semantics

## Available tools and filters

`kivloo_pull_analytics` returns analytical rows with IDs and source URLs, up to 100 per page. `kivloo_analytics_summary` computes metrics over up to 5,000 rows and returns coverage information. Both tools enforce the signed-in workspace and existing access rules.

Shared input: `dataset`, UTC `from`/`to`, optional `facility_id`, optional native `status`, and `time_field` (default `created_at`). Inspections also accept `template_id`; readings accept `sensor_id`. Summaries add `group_by` (`none`, `day`, `site`, or inspections-only `template`) and an IANA `timezone`, default UTC. Raw rows add `offset` (0–1,000,000) and `page_size` (1–100). Narrow queries that exceed supported retrieval limits; do not claim a full export beyond them.

Time zone controls summary day buckets, not the date-range boundaries. Supply correct UTC boundaries yourself. Site and template names can be resolved through `kivloo_list_records`; sensor metadata through the sensors resource.

## Inspections

The dataset is saved inspection logs, not checklist definitions or scheduled obligations. Fields include site/template IDs, template version, status, recorded score, deviation flag/count, and creation/completion/signature timestamps. Raw form answers, signature payloads, staff names and arbitrary database fields are not included. Question-level failure analysis needs evidence unavailable in this dataset; do not infer it from aggregate deviation counts.

Use `created_at` for records created during a period. Use `time_field: completed_at` for completion activity during a period; this excludes records without a completion timestamp. These are different cohorts. Filtering to completed statuses before calculating a completion rate changes the denominator and cannot answer “what share of all inspections was completed?”

Server completion count includes `completed` and `signed`, plus `locked` records with a completion timestamp. Completion rate divides that count by the records processed in the selected cohort. It is not the proportion of scheduled or expected inspections completed. No scheduled denominator is provided.

Average score includes finite, non-null scores for those completed records. Zero is a real score; no scored records yields null. Scores use recorded units and may follow different template scoring methods. Check template settings/version with `kivloo_get_record` on `templates` before combining or comparing scores. Do not label every recorded score a percentage or compare unlike score scales.

Deviation count is the sum of recorded nonnegative counts; missing/invalid counts are reported separately. The deviation flag and count can disagree: disclose inconsistencies rather than silently deriving one from the other.

## Corrective actions

Records are selected by `created_at`. Native statuses: `open`, `in_progress`, `pending_verification`, `verified`, `closed`, `overdue`. Server unresolved count excludes verified and closed records. Overdue-unresolved count requires an unresolved record with a recorded due date before the response's `as_of` timestamp. A missing due date is unknown, not on-time.

Status reflects the current record. A created-in-September cohort queried today is not a snapshot of September's open backlog. Comparing created-period cohorts can describe their current state; it cannot reconstruct historic backlog or closure timing without event history. Separate recorded status `overdue` from a calculation based on due date when they differ.

## Sensor readings

Readings always filter on `recorded_at`, regardless of the default `time_field` input. Summary values are separated by sensor ID and recorded unit, including missing-unit groups. Do not combine Celsius/Fahrenheit, unrelated sensor types, or missing units without verified conversions and measurement definitions.

Site filtering/grouping uses the sensor's current site association, not its historic location at each reading. The anomaly metric counts stored `is_anomaly` flags; it does not recalculate thresholds or prove food safety. Frequency and missing intervals require the expected sampling interval and device history. An average alone can hide important excursions; inspect minima, maxima and anomalous rows where relevant.

## Comparisons and reproducibility

Keep filters, time basis and score/unit definitions consistent between periods. State unequal period lengths and use an appropriate exposure denominator before comparing volumes. Use weighted means from sums/counts or raw values; use total numerators/denominators for combined rates. Record retrieval time and coverage because these tools do not offer transactionally frozen snapshots.
