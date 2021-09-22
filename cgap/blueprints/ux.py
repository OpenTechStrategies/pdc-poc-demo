import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)

from cgap.db import get_db

bp = Blueprint('ux', __name__, url_prefix='/ux')

@bp.route('/apply', methods=('GET', 'POST'))
def apply():
    return render_template('apply.html')

