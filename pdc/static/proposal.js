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
        'organization': {
          'name': '',
          'mission_statement': '',
          'website': '',
          'entity_type': '',
          'registration_number': '',
          'address': '',
          'phone': '',
          'email': '',
          'dba_name': '',
          'ceo_name': '',
          'ceo_title': '',
          'ceo_address': '',
          'operating_budget': '',
          'is_lobbying': '',
          'start_date': '',
          'grant_agreement_signatory': '',
          'fiscal_end_date': '',
        },
        'name': '',
        'created': '',
        'primary_contact_name': '',
        'requested_budget': '',
        'investment_start_date': '',
        'investment_end_date': '',
        'total_budget': '',
        'fiscal_sponsor_name': '',
        'description': '',
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
        const url = `/poc-demo/api/proposals/${this.proposalId}`
        var request = new XMLHttpRequest();
        request.open('GET', url, true);

        var context = this
        request.onload = function() {
          if (this.status >= 200 && this.status < 400) {
            context.proposal = JSON.parse(this.response);
          }
        };

        request.onerror = function() {
          console.log('Could not load proposal data.');
        };

        request.send();
      } catch {}
    },
    generateOrganizationViewUrl(id) {
      return `/poc-demo/organization/${id}`;
    }
  },

  template: `
<h1 class="text-primary">Proposal (#{{proposal.id}})</h1>
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
    <td>{{proposal.organization.name}} <a :href="generateOrganizationViewUrl(proposal.organization.id)">(View)</a></td>
  </tr>
  <tr>
    <th scope="row">Submission Date</th>
    <td>{{proposal.created}}</td>
  </tr>
  <tr>
    <th scope="row">Project Name</th>
    <td>{{proposal.name}}</td>
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
