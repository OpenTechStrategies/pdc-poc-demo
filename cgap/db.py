import sqlite3
import csv
from io import TextIOWrapper

import click
from flask import current_app, g
from flask.cli import with_appcontext


def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(
            current_app.config['DATABASE'],
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.db.row_factory = sqlite3.Row

    return g.db

def close_db(e=None):
    db = g.pop('db', None)

    if db is not None:
        db.close()

def load_organization_seed():
    db = get_db()

    with current_app.open_resource('database/seeds/organization.csv') as f:
        organization_reader = csv.reader(TextIOWrapper(f))
        for organization_row in organization_reader:
            organization = {
                'name': organization_row[1],
                'mission_statement': organization_row[2],
                'website': organization_row[3],
                'entity_type': organization_row[4],
                'registration_number': organization_row[5],
                'address': organization_row[6],
                'phone': organization_row[7],
                'email': organization_row[8],
                'dba_name': organization_row[9],
                'ceo_name': organization_row[12],
                'ceo_title': '',
                'ceo_address': '',
                'operating_budget': organization_row[13],
                'is_lobbying': bool(organization_row[14]),
                'start_date': organization_row[15],
                'grant_agreement_signatory': organization_row[18],
                'fiscal_end_date': organization_row[19],
            }
            insert_query = '''
            INSERT INTO organizations (
                name,
                mission_statement,
                website,
                entity_type,
                registration_number,
                address,
                phone,
                email,
                dba_name,
                ceo_name,
                ceo_title,
                ceo_address,
                operating_budget,
                is_lobbying,
                start_date,
                grant_agreement_signatory,
                fiscal_end_date
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'''

            try:
                db.execute(insert_query, [
                    organization.get('name'),
                    organization.get('mission_statement'),
                    organization.get('website'),
                    organization.get('entity_type'),
                    organization.get('registration_number'),
                    organization.get('address'),
                    organization.get('phone'),
                    organization.get('email'),
                    organization.get('dba_name'),
                    organization.get('ceo_name'),
                    organization.get('ceo_title'),
                    organization.get('ceo_address'),
                    organization.get('operating_budget'),
                    organization.get('is_lobbying'),
                    organization.get('start_date'),
                    organization.get('grant_agreement_signatory'),
                    organization.get('fiscal_end_date'),
                ])
                db.commit()

            except sqlite3.Error as er:
                print('SQLite error: %s' % (' '.join(er.args)))

def load_proposal_seed():
    db = get_db()

    with current_app.open_resource('database/seeds/proposal.csv') as f:
        proposal_reader = csv.reader(TextIOWrapper(f))
        for proposal_row in proposal_reader:
            proposal = {
                'organization_id': proposal_row[1],
                'primary_contact_name': proposal_row[3],
                'requested_budget': proposal_row[4],
                'investment_start_date': proposal_row[5],
                'investment_end_date': proposal_row[6],
                'total_budget': proposal_row[7],
                'fiscal_sponsor_name': proposal_row[8],
                'description': proposal_row[9],
            }
            insert_query = '''
            INSERT INTO proposals (
                organization_id,
                primary_contact_name,
                requested_budget,
                investment_start_date,
                investment_end_date,
                total_budget,
                fiscal_sponsor_name,
                description
            ) VALUES (?,?,?,?,?,?,?,?)'''

            try:
                db.execute(insert_query, [
                    proposal.get('organization_id'),
                    proposal.get('primary_contact_name'),
                    proposal.get('requested_budget'),
                    proposal.get('investment_start_date'),
                    proposal.get('investment_end_date'),
                    proposal.get('total_budget'),
                    proposal.get('fiscal_sponsor_name'),
                    proposal.get('description'),
                ])
                db.commit()

            except sqlite3.Error as er:
                print('SQLite error: %s' % (' '.join(er.args)))

def init_db():
    db = get_db()

    with current_app.open_resource('database/schema.sql') as f:
        db.executescript(f.read().decode('utf8'))

def seed_db():
    load_organization_seed()
    load_proposal_seed()

@click.command('init-db')
@click.option('--seed/--no-seed', default=False)
@with_appcontext
def init_db_command(seed):
    """Clear the existing data and create new tables."""
    init_db()
    click.echo('Initialized the database.')

    if (seed):
        seed_db()
        click.echo('Seeded the database.')

def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)

