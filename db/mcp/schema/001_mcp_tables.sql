IF OBJECT_ID('dbo.action_log', 'U') IS NOT NULL
    DROP TABLE dbo.action_log;
GO

IF OBJECT_ID('dbo.approval_requests', 'U') IS NOT NULL
    DROP TABLE dbo.approval_requests;
GO

IF OBJECT_ID('dbo.account_notes', 'U') IS NOT NULL
    DROP TABLE dbo.account_notes;
GO

IF OBJECT_ID('dbo.accounts', 'U') IS NOT NULL
    DROP TABLE dbo.accounts;
GO

CREATE TABLE dbo.accounts (
    account_id NVARCHAR(50) NOT NULL PRIMARY KEY,
    account_name NVARCHAR(200) NOT NULL,
    current_status NVARCHAR(100) NOT NULL,
    owner_name NVARCHAR(150) NOT NULL,
    owner_email NVARCHAR(255) NOT NULL,
    last_updated_at DATETIME2 NOT NULL,
    last_updated_by NVARCHAR(150) NOT NULL,
    last_flow_id NVARCHAR(100) NULL
);
GO

CREATE TABLE dbo.account_notes (
    note_id NVARCHAR(50) NOT NULL PRIMARY KEY,
    account_id NVARCHAR(50) NOT NULL,
    account_name NVARCHAR(200) NOT NULL,
    note_text NVARCHAR(MAX) NOT NULL,
    note_type NVARCHAR(100) NOT NULL,
    created_at DATETIME2 NOT NULL,
    created_by NVARCHAR(150) NOT NULL,
    flow_id NVARCHAR(100) NOT NULL,
    CONSTRAINT FK_account_notes_accounts
        FOREIGN KEY (account_id) REFERENCES dbo.accounts(account_id)
);
GO

CREATE TABLE dbo.approval_requests (
    approval_id NVARCHAR(50) NOT NULL PRIMARY KEY,
    flow_id NVARCHAR(100) NOT NULL,
    account_id NVARCHAR(50) NOT NULL,
    account_name NVARCHAR(200) NOT NULL,
    action_type NVARCHAR(100) NOT NULL,
    target_system NVARCHAR(100) NOT NULL,
    target_record NVARCHAR(255) NOT NULL,
    proposed_payload NVARCHAR(MAX) NOT NULL,
    approval_status NVARCHAR(50) NOT NULL,
    requested_at DATETIME2 NOT NULL,
    requested_by NVARCHAR(150) NOT NULL,
    approved_at DATETIME2 NULL,
    approved_by NVARCHAR(150) NULL,
    CONSTRAINT FK_approval_requests_accounts
        FOREIGN KEY (account_id) REFERENCES dbo.accounts(account_id)
);
GO

CREATE TABLE dbo.action_log (
    action_id NVARCHAR(50) NOT NULL PRIMARY KEY,
    flow_id NVARCHAR(100) NOT NULL,
    account_id NVARCHAR(50) NOT NULL,
    account_name NVARCHAR(200) NOT NULL,
    action_type NVARCHAR(100) NOT NULL,
    target_system NVARCHAR(100) NOT NULL,
    action_status NVARCHAR(50) NOT NULL,
    detail_message NVARCHAR(MAX) NOT NULL,
    created_at DATETIME2 NOT NULL,
    created_by NVARCHAR(150) NOT NULL,
    CONSTRAINT FK_action_log_accounts
        FOREIGN KEY (account_id) REFERENCES dbo.accounts(account_id)
);
GO

CREATE INDEX IX_accounts_account_name
    ON dbo.accounts (account_name);
GO

CREATE INDEX IX_account_notes_account_id
    ON dbo.account_notes (account_id);
GO

CREATE INDEX IX_account_notes_flow_id
    ON dbo.account_notes (flow_id);
GO

CREATE INDEX IX_approval_requests_account_id
    ON dbo.approval_requests (account_id);
GO

CREATE INDEX IX_approval_requests_flow_id
    ON dbo.approval_requests (flow_id);
GO

CREATE INDEX IX_action_log_account_id
    ON dbo.action_log (account_id);
GO

CREATE INDEX IX_action_log_flow_id
    ON dbo.action_log (flow_id);
GO