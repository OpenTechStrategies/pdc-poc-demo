import csv
from io import TextIOWrapper
from peewee import *
import click

DATABASE = 'instance/pdc.sqlite'
database = SqliteDatabase(DATABASE)

class BaseModel(Model):
    class Meta:
        database = database


class Organization(BaseModel):
    id = AutoField()
    name = TextField()
    mission_statement = TextField()
    website = TextField()
    entity_type = TextField()
    registration_number = TextField()
    address = TextField()
    phone = TextField()
    email = TextField()
    dba_name = TextField()
    ceo_name = TextField()
    ceo_title = TextField()
    ceo_address = TextField()
    operating_budget = TextField()
    is_lobbying = TextField()
    start_date = TextField()
    grant_agreement_signatory = TextField()
    fiscal_end_date = TextField()


class Proposal(BaseModel):
    id = AutoField()
    organization = ForeignKeyField(Organization, backref='proposals')
    name = TextField()
    created = TimestampField()
    primary_contact_name = TextField()
    requested_budget = TextField()
    investment_start_date = TextField()
    investment_end_date = TextField()
    total_budget = TextField()
    fiscal_sponsor_name = TextField()
    description = TextField()

MODELS = [
    Organization,
    Proposal,
]

def create_tables():
    with database:
        database.create_tables(MODELS)

def drop_tables():
    with database:
        database.drop_tables(MODELS)

def get_db():
    return database

def load_organization_seed():
    with open('pdc/database/seeds/organization.csv') as f:
        organization_reader = csv.reader(f)
        for organization_row in organization_reader:
            Organization.create(
                name = organization_row[1],
                mission_statement = organization_row[2],
                website = organization_row[3],
                entity_type = organization_row[4],
                registration_number = organization_row[5],
                address = organization_row[6],
                phone = organization_row[7],
                email = organization_row[8],
                dba_name = organization_row[9],
                ceo_name = organization_row[12],
                ceo_title = '',
                ceo_address = '',
                operating_budget = organization_row[13],
                is_lobbying = organization_row[14],
                start_date = organization_row[15],
                grant_agreement_signatory = organization_row[18],
                fiscal_end_date = organization_row[19],
            )


def load_proposal_seed():
    db = get_db()

    with open('pdc/database/seeds/proposal.csv') as f:
        proposal_reader = csv.reader(f)
        for proposal_row in proposal_reader:
            Proposal.create(
                organization_id = proposal_row[1],
                name = proposal_row[3],
                primary_contact_name = proposal_row[4],
                requested_budget = proposal_row[5],
                investment_start_date = proposal_row[6],
                investment_end_date = proposal_row[7],
                total_budget = proposal_row[8],
                fiscal_sponsor_name = proposal_row[9],
                description = proposal_row[10],
            )


def seed_db():
    load_organization_seed()
    load_proposal_seed()

def open_db():
    database.connect()

def close_db(e=None):
    database.close()
    return

@click.command('init-db')
@click.option('--seed/--no-seed', default=False)
def init_db_command(seed):
    """Clear the existing data and create new tables."""
    drop_tables()
    create_tables()
    click.echo('Initialized the database.')

    if (seed):
        seed_db()
        click.echo('Seeded the database.')

def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)

