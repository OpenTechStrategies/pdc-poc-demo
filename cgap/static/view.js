const app = Vue.createApp({});

function hasMatch(firstString, secondString) {
  return firstString.toLowerCase().indexOf(secondString.toLowerCase()) >= 0;
}

app.component('Proposal', {
  props: ['proposalId'],
  data: function() {
    return {
      proposal: {
        'id': '',
        'organization_id': '',
        'created': '',
        'primary_contact_name': '',
        'requested_budget': '',
        'investment_start_date': '',
        'investment_end_date': '',
        'total_budget': '',
        'fiscal_sponsor_name': '',
        'description': '',
        'organization_name': '',
        'organization_mission_statement': '',
        'organization_website': '',
        'organization_entity_type': '',
        'organization_registration_number': '',
        'organization_address': '',
        'organization_phone': '',
        'organization_email': '',
        'organization_dba_name': '',
        'organization_ceo_name': '',
        'organization_ceo_title': '',
        'organization_ceo_address': '',
        'organization_operating_budget': '',
        'organization_is_lobbying': '',
        'organization_start_date': '',
        'organization_grant_agreement_signatory': '',
        'organization_fiscal_end_date': '',
      },
    }
  },
  mounted() {
    this.loadProposal();
  },
  computed: {},
  methods: {
    loadProposal(query) {
      try {
        const url = `/api/proposals/${this.proposalId}`
        var request = new XMLHttpRequest();
        request.open('GET', url, true);

        var context = this
        request.onload = function() {
          if (this.status >= 200 && this.status < 400) {
            const row = JSON.parse(this.response);
            context.proposal = {
              'id': row[0],
              'organization_id': row[1],
              'created': row[2],
              'primary_contact_name': row[3],
              'requested_budget': row[4],
              'investment_start_date': row[5],
              'investment_end_date': row[6],
              'total_budget': row[7],
              'fiscal_sponsor_name': row[8],
              'description': row[9],
              'organization_name': row[11],
              'organization_mission_statement': row[12],
              'organization_website': row[13],
              'organization_entity_type': row[14],
              'organization_registration_number': row[15],
              'organization_address': row[16],
              'organization_phone': row[17],
              'organization_email': row[18],
              'organization_dba_name': row[19],
              'organization_ceo_name': row[20],
              'organization_ceo_title': row[21],
              'organization_ceo_address': row[22],
              'organization_operating_budget': row[23],
              'organization_is_lobbying': row[24],
              'organization_start_date': row[25],
              'organization_grant_agreement_signatory': row[26],
              'organization_fiscal_end_date': row[27],
            };
          }
        };

        request.onerror = function() {
          console.log('Could not load proposal data.');
        };

        request.send();
      } catch {}
    },
    handleInput(event) {
      this.fetchProposals(event.target.value);
    }
  },

  template: `
<h1>Proposal (#{{proposal.id}})</h1>
<h2>Organization Fields</h2>
<table class="table">
<thead>
  <tr>
    <th scope="col">Field</th>
    <th scope="col">Value</th>
  </tr>
</thead>
<tbody>
  <tr>
    <th scope="row">Organization Name</th>
    <td>{{proposal.organization_name}}</td>
  </tr>
  <tr>
    <th scope="row">Organization Mission Statement</th>
    <td>{{proposal.organization_mission_statement}}</td>
  </tr>
  <tr>
    <th scope="row">Organization Website</th>
    <td>{{proposal.organization_website}}</td>
  </tr>
  <tr>
    <th scope="row">Organization Entity Type</th>
    <td>{{proposal.organization_entity_type}}</td>
  </tr>
  <tr>
    <th scope="row">Organization Registration Number</th>
    <td>{{proposal.organization_registration_number}}</td>
  </tr>
  <tr>
    <th scope="row">Organization Address</th>
    <td>{{proposal.organization_address}}</td>
  </tr>
  <tr>
    <th scope="row">Organization Phone</th>
    <td>{{proposal.organization_phone}}</td>
  </tr>
  <tr>
    <th scope="row">Organization Email</th>
    <td>{{proposal.organization_email}}</td>
  </tr>
  <tr>
    <th scope="row">Organization DBA</th>
    <td>{{proposal.organization_dba_name}}</td>
  </tr>
  <tr>
    <th scope="row">Organization CEO</th>
    <td>{{proposal.organization_ceo_name}}</td>
  </tr>
  <tr>
    <th scope="row">Operating Budget</th>
    <td>{{proposal.organization_operating_budget}}</td>
  </tr>
  <tr>
    <th scope="row">Lobbying Activity</th>
    <td>{{proposal.organization_is_lobbying}}</td>
  </tr>
  <tr>
    <th scope="row">Organization Start Date</th>
    <td>{{proposal.organization_start_date}}</td>
  </tr>
  <tr>
    <th scope="row">Organization Signatory</th>
    <td>{{proposal.organization_grant_agreement_signatory}}</td>
  </tr>
  <tr>
    <th scope="row">Organization Fiscal End Date</th>
    <td>{{proposal.organization_fiscal_end_date}}</td>
  </tr>
</tbody>
</table>
<h2>Proposal Fields</h2>
<table class="table">
<thead>
  <tr>
    <th scope="col">Field</th>
    <th scope="col">Value</th>
  </tr>
</thead>
<tbody>
  <tr>
    <th scope="row">Submission Date</th>
    <td>{{proposal.created}}</td>
  </tr>
  <tr>
    <th scope="row">Primary Contact</th>
    <td>{{proposal.primary_contact_name}}</td>
  </tr>
  <tr>
    <th scope="row">Description</th>
    <td>{{proposal.description}}</td>
  </tr>
  <tr>
    <th scope="row">Requested Budget</th>
    <td>{{proposal.requested_budget}}</td>
  </tr>
  <tr>
    <th scope="row">Investment Start Date</th>
    <td>{{proposal.investment_start_date}}</td>
  </tr>
  <tr>
    <th scope="row">Investment End Date</th>
    <td>{{proposal.investment_end_date}}</td>
  </tr>
  <tr>
    <th scope="row">Total Budget</th>
    <td>{{proposal.total_budget}}</td>
  </tr>
  <tr>
    <th scope="row">Fiscal Sponsor</th>
    <td>{{proposal.fiscal_sponsor_name}}</td>
  </tr>
</tbody>
</table>
`
})
