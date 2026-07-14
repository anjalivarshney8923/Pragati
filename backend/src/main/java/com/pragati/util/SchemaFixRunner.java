package com.pragati.util;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class SchemaFixRunner implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        log.info("[DB Migration] Checking database schema...");
        try {
            // 1. Add columns to complaints if they don't exist
            jdbcTemplate.execute("ALTER TABLE complaints ADD COLUMN IF NOT EXISTS bdo_escalation_time TIMESTAMP");
            
            // 2. Add columns to notifications if they don't exist
            jdbcTemplate.execute("ALTER TABLE notifications ADD COLUMN IF NOT EXISTS user_id BIGINT");
            jdbcTemplate.execute("ALTER TABLE notifications ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'ESCALATION'");
            
            // 3. Create 'work_proofs' table if it doesn't exist
            jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS work_proofs (" +
                "id SERIAL PRIMARY KEY, " +
                "complaint_id BIGINT, " +
                "description TEXT, " +
                "image_url VARCHAR(255), " +
                "created_at TIMESTAMP)");
            
            log.info("[DB Migration] Success: Columns and tables created.");

            // 4. Data Cleaning: Ensure no rows violate the upcoming constraint
            try {
                jdbcTemplate.execute("UPDATE notifications SET type = 'INFO' WHERE type IS NULL OR type NOT IN ('INFO', 'ALERT', 'ESCALATION', 'SYSTEM', 'UPDATE')");
                log.info("[DB Migration] Success: Legacy data cleaned for 'type' column.");
            } catch (Exception e) {
                log.warn("[DB Migration] Error cleaning legacy data: {}", e.getMessage());
            }

            // 5. Fix the 'type' check constraint to allow SYSTEM and UPDATE
            try {
                jdbcTemplate.execute("ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check");
                jdbcTemplate.execute("ALTER TABLE notifications ADD CONSTRAINT notifications_type_check CHECK (type IN ('INFO', 'ALERT', 'ESCALATION', 'SYSTEM', 'UPDATE'))");
                log.info("[DB Migration] Success: Constraint 'notifications_type_check' updated.");
            } catch (Exception e) {
                log.error("[DB Migration] Notification type constraint check: {}", e.getMessage());
            }

            // 6. Add foreign key constraint for data integrity
            try {
                jdbcTemplate.execute("ALTER TABLE notifications ADD CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(id)");
                log.info("[DB Migration] Success: Foreign key constraint added.");
            } catch (Exception e) {
                // Constraint might already exist, which is fine
                log.debug("Constraint check: {}", e.getMessage());
            }
            
        } catch (Exception e) {
            log.error("[DB Migration] Error updating schema: {}", e.getMessage());
        }
    }
}
