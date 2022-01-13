const app = Vue.createApp({});

function hasMatch(firstString, secondString) {
  return firstString.toLowerCase().indexOf(secondString.toLowerCase()) >= 0;
}

app.component('Organization', {
  props: ['organizationId'],
  data: function() {
    return {
      organization: {
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
      proposals: [],
    }
  },
  mounted() {
    this.loadOrganization();
    this.loadProposals();
  },
  computed: {},
  methods: {
    generateProposalViewUrl(id) {
      return `/poc-demo/proposal/${id}`;
    },
    loadOrganization(query) {
      try {
        const url = `/poc-demo/api/organizations/${this.organizationId}`
        var request = new XMLHttpRequest();
        request.open('GET', url, true);

        var context = this
        request.onload = function() {
          if (this.status >= 200 && this.status < 400) {
            context.organization = JSON.parse(this.response);
          }
        };

        request.onerror = function() {
          console.log('Could not load organization data.');
        };

        request.send();
      } catch {}
    },
    loadProposals(query) {
      try {
        const url = `/poc-demo/api/organizations/${this.organizationId}/proposals`
        var request = new XMLHttpRequest();
        request.open('GET', url, true);

        var context = this
        request.onload = function() {
          if (this.status >= 200 && this.status < 400) {
            context.proposals = JSON.parse(this.response);
          }
        };

        request.onerror = function() {
          console.log('Could not load organization proposals.');
        };

        request.send();
      } catch {}
    },
  },

  template: `
<h1 class="text-primary">Organization (#{{organization.id}})</h1>
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
    <td>{{organization.name}}</td>
  </tr>
  <tr>
    <th scope="row">Organization Mission Statement</th>
    <td>{{organization.mission_statement}}</td>
  </tr>
  <tr>
    <th scope="row">Organization Website</th>
    <td>{{organization.website}}</td>
  </tr>
  <tr>
    <th scope="row">Organization Entity Type</th>
    <td>{{organization.entity_type}}</td>
  </tr>
  <tr>
    <th scope="row">Organization Registration Number</th>
    <td>{{organization.registration_number}}</td>
  </tr>
  <tr>
    <th scope="row">Organization Address</th>
    <td>{{organization.address}}</td>
  </tr>
  <tr>
    <th scope="row">Organization Phone</th>
    <td>{{organization.phone}}</td>
  </tr>
  <tr>
    <th scope="row">Organization Email</th>
    <td>{{organization.email}}</td>
  </tr>
  <tr>
    <th scope="row">Organization DBA</th>
    <td>{{organization.dba_name}}</td>
  </tr>
  <tr>
    <th scope="row">Organization CEO</th>
    <td>{{organization.ceo_name}}</td>
  </tr>
  <tr>
    <th scope="row">Operating Budget</th>
    <td>{{organization.operating_budget}}</td>
  </tr>
  <tr>
    <th scope="row">Lobbying Activity</th>
    <td>{{organization.is_lobbying}}</td>
  </tr>
  <tr>
    <th scope="row">Organization Start Date</th>
    <td>{{organization.start_date}}</td>
  </tr>
  <tr>
    <th scope="row">Organization Signatory</th>
    <td>{{organization.grant_agreement_signatory}}</td>
  </tr>
  <tr>
    <th scope="row">Organization Fiscal End Date</th>
    <td>{{organization.fiscal_end_date}}</td>
  </tr>
</tbody>
</table>
<h2>Proposals</h2>
<ul>
  <li v-for="proposal in proposals"><a :href="generateProposalViewUrl(proposal.id)">{{proposal.name}}</a></li>
</ul>
`
})
