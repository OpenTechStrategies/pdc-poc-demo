DROP TABLE IF EXISTS organizations;
DROP TABLE IF EXISTS proposals;
DROP TABLE IF EXISTS board_members;

CREATE TABLE organizations (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	mission_statement TEXT NOT NULL,
	website TEXT NOT NULL,
	entity_type TEXT NOT NULL,
	registration_number TEXT NOT NULL,
	address TEXT NOT NULL,
	phone TEXT NOT NULL,
	email TEXT NOT NULL,
	dba_name TEXT NOT NULL,
	ceo_name TEXT NOT NULL,
	ceo_title TEXT NOT NULL,
	ceo_address TEXT NOT NULL,
	operating_budget DECIMAL(16,2) NOT NULL,
	is_lobbying BOOLEAN NOT NULL,
	start_date TEXT NOT NULL,
	grant_agreement_signatory TEXT NOT NULL,
	fiscal_end_date DATE NOT NULL
);

CREATE TABLE proposals (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	organization_id INTEGER NOT NULL,
	created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	primary_contact_name TEXT NOT NULL,
	requested_budget DECIMAL(16,2) NOT NULL,
	investment_start_date DATE NOT NULL,
	investment_end_date DATE NOT NULL,
	total_budget DECIMAL(16,2) NOT NULL,
	fiscal_sponsor_name TEXT NOT NULL,
	description TEXT NOT NULL,
	FOREIGN KEY (organization_id) REFERENCES user (organization)
);

CREATE TABLE board_members (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	organization_id INTEGER NOT NULL,
	name TEXT NOT NULL,
	affiliation TEXT NOT NULL,
	FOREIGN KEY (organization_id) REFERENCES user (organization)
);

CREATE TABLE documents (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	organization_id INTEGER NOT NULL,
	internal_type TEXT NOT NULL,
	mime_type TEXT NOT NULL,
	filename TEXT NOT NULL,
	content BLOB NOT NULL,
	FOREIGN KEY (organization_id) REFERENCES user (organization)
);

CREATE TABLE geographic_area (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	organization_id INTEGER NOT NULL,
	name TEXT NOT NULL,
	FOREIGN KEY (organization_id) REFERENCES user (organization)
)
