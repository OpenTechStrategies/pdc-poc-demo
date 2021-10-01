import functools
import json
from flask import (
    Blueprint, g, request, redirect, url_for
)
from playhouse.shortcuts import model_to_dict
from cgap.db import (
    Organization,
    Proposal,
)

bp = Blueprint('api', __name__, url_prefix='/poc-demo/api')

@bp.route('/organizations/', methods=['GET'])
def getOrganizations():
    organizations = Organization.select()
    return json.dumps(list(organizations.dicts()))


@bp.route('/organizations/', methods=['POST'])
def createOrganization():
    organization = Organization.create(
        name = request.form.get('name'),
        mission_statement = request.form.get('mission_statement'),
        website = request.form.get('website'),
        entity_type = request.form.get('entity_type'),
        registration_number = request.form.get('registration_number'),
        address = request.form.get('address'),
        phone = request.form.get('phone'),
        email = request.form.get('email'),
        dba_name = request.form.get('dba_name'),
        ceo_name = request.form.get('ceo_name'),
        ceo_title = request.form.get('ceo_title'),
        ceo_address = request.form.get('ceo_address'),
        operating_budget = request.form.get('operating_budget'),
        is_lobbying = request.form.get('is_lobbying'),
        start_date = request.form.get('start_date'),
        grant_agreement_signatory = request.form.get('grant_agreement_signatory'),
        fiscal_end_date = request.form.get('fiscal_end_date'),
    )

    return redirect(url_for(
        'api.getOrganizationById',
        organization_id=organization.id
    ))

@bp.route('/organizations/<int:organization_id>', methods=['GET'])
def getOrganizationById(organization_id):
    organization = Organization.get_by_id(organization_id)
    return json.dumps(model_to_dict(organization))

@bp.route('/organizations/<int:organization_id>', methods=['POST'])
def updateOrganization(organization_id):
    Organization.update(
        name=request.form.get('name'),
        mission_statement=request.form.get('mission_statement'),
        website=request.form.get('website'),
        entity_type=request.form.get('entity_type'),
        registration_number=request.form.get('registration_number'),
        address=request.form.get('address'),
        phone=request.form.get('phone'),
        email=request.form.get('email'),
        dba_name=request.form.get('dba_name'),
        ceo_name=request.form.get('ceo_name'),
        ceo_title=request.form.get('ceo_title'),
        ceo_address=request.form.get('ceo_address'),
        operating_budget=request.form.get('operating_budget'),
        is_lobbying=request.form.get('is_lobbying'),
        start_date=request.form.get('start_date'),
        grant_agreement_signatory=request.form.get('grant_agreement_signatory'),
        fiscal_end_date=request.form.get('fiscal_end_date'),
    ).where(Organization.id == organization_id).execute()

    return redirect(url_for(
        'api.getOrganizationById',
        organization_id=organization_id
    ))


@bp.route('/organizations/<int:organization_id>/proposals', methods=['GET'])
def getProposalsByOrganizationId(organization_id):
    query = Proposal.select(
        Proposal,
        Organization,
    ).join(
        Organization,
        attr='organization'
    ).where(
        Proposal.organization_id == organization_id,
    )

    print(organization_id)
    proposals = [model_to_dict(proposal, recurse=True) for proposal in query]
    return json.dumps(proposals, default=str)


@bp.route('/proposals/', methods=['GET'])
def getProposals():
    query = Proposal.select(
        Proposal,
        Organization,
    ).join(Organization)
    proposals = [model_to_dict(proposal, recurse=True) for proposal in query]
    return json.dumps(proposals, default=str)


@bp.route('/proposals/<int:proposal_id>', methods=['GET'])
def getProposalById(proposal_id):
    query = Proposal.select(
        Proposal,
        Organization,
    ).join(
        Organization,
        attr='organization'
    ).where(
        Proposal.id == proposal_id,
    )
    proposal = [model_to_dict(proposal, recurse=True) for proposal in query][0]
    return json.dumps(proposal, default=str)


@bp.route('/proposals/', methods=['POST'])
def createProposal():
    proposal = Proposal.create(
        organization_id=request.form.get('organization_id'),
        name=request.form.get('name'),
        primary_contact_name=request.form.get('primary_contact_name'),
        requested_budget=request.form.get('requested_budget'),
        investment_start_date=request.form.get('investment_start_date'),
        investment_end_date=request.form.get('investment_end_date'),
        total_budget=request.form.get('total_budget'),
        fiscal_sponsor_name=request.form.get('fiscal_sponsor_name'),
        description=request.form.get('description'),
    )

    return redirect(url_for(
        'api.getProposalById',
        proposal_id=proposal.id
    ))
