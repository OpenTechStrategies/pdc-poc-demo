import functools
import json

from flask import (
    Blueprint, g, request
)

from cgap.db import get_db

bp = Blueprint('api', __name__, url_prefix='/api')

@bp.route('/organizations/', methods=('GET', 'POST'))
def getOrganizations():
    db = get_db()
    organizations = db.execute(
        'SELECT * FROM organizations',
    ).fetchall()
    return json.dumps([tuple(organization) for organization in organizations])

@bp.route('/organizations/<int:organization_id>', methods=['GET'])
def getOrganizationById(organization_id):
    db = get_db()
    organization = db.execute(
        'SELECT * FROM organizations WHERE id=?',
        [organization_id]
    ).fetchone()
    return json.dumps(tuple(organization))


@bp.route('/organizations/<int:organization_id>', methods=['POST'])
def updateOrganization(organization_id):
    query_data = [
        request.form.get('name'),
        request.form.get('mission_statement'),
        request.form.get('website'),
        request.form.get('entity_type'),
        request.form.get('registration_number'),
        request.form.get('address'),
        request.form.get('phone'),
        request.form.get('email'),
        request.form.get('dba_name'),
        request.form.get('ceo_name'),
        request.form.get('ceo_title'),
        request.form.get('ceo_address'),
        request.form.get('operating_budget'),
        request.form.get('is_lobbying'),
        request.form.get('start_date'),
        request.form.get('grant_agreement_signatory'),
        request.form.get('fiscal_end_date'),
        organization_id,
    ]
    db = get_db()
    organization = db.execute(
        '''
        UPDATE organizations
           SET name=?,
               mission_statement=?,
               website=?,
               entity_type=?,
               registration_number=?,
               address=?,
               phone=?,
               email=?,
               dba_name=?,
               ceo_name=?,
               ceo_title=?,
               ceo_address=?,
               operating_budget=?,
               is_lobbying=?,
               start_date=?,
               grant_agreement_signatory=?,
               fiscal_end_date=?
         WHERE id=?
        ''',
        query_data,
    )
    db.commit()
    print(query_data)
    return json.dumps(tuple(organization))
