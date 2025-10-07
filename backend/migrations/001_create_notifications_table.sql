-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR NOT NULL CHECK (type IN ('personalized', 'announcement', 'direct')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- Add comment to the table
COMMENT ON TABLE notifications IS 'Stores user notifications including personalized AI-generated health tips, admin announcements, and direct messages';
COMMENT ON COLUMN notifications.user_id IS 'User ID for personalized/direct notifications, NULL for global announcements';
COMMENT ON COLUMN notifications.type IS 'Type of notification: personalized (AI-generated), announcement (broadcast to all), or direct (targeted message)';
