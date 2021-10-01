import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)

from cgap.db import get_db

bp = Blueprint('ux', __name__, url_prefix='/')

@bp.route('/', methods=('GET', 'POST'))
def landing():
    return render_template('landing.html')

@bp.route('/gms-apply', methods=('GET', 'POST'))
def apply():
    return render_template('apply.html')

@bp.route('/search', methods=('GET', 'POST'))
def review():
    return render_template('search.html')

@bp.route('/apidoc', methods=('GET', 'POST'))
def apidoc():
    return render_template('apidoc.html')

@bp.route('/proposal/<int:proposal_id>', methods=('GET', 'POST'))
def viewProposal(proposal_id):
    return render_template('proposal.html', proposal_id=proposal_id)

@bp.route('/organization/<int:organization_id>', methods=('GET', 'POST'))
def viewOrganization(organization_id):
    return render_template('organization.html', organization_id=organization_id)
