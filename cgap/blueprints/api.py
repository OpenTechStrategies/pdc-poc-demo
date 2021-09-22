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

@bp.route('/organizations/<int:organization_id>', methods=('GET', 'POST'))
def getOrganizationById(organization_id):
    db = get_db()
    organization = db.execute(
        'SELECT * FROM organizations WHERE id=?',
        [organization_id]
    ).fetchone()
    return json.dumps(tuple(organization))
