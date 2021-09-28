const app = Vue.createApp({});

function hasMatch(firstString, secondString) {
  return firstString.toLowerCase().indexOf(secondString.toLowerCase()) >= 0;
}

app.component('ProposalSearch', {
  emits: ['update:modelValue'],
  data: function() {
    return {
      inputValue: '',
      selectedMatchIndex: null,
      matches: [],
      hasFocus: false,
    }
  },
  computed: {
    filteredMatches() {
      if (!this.hasInputValue) {
        return []
      }

      // We want to filter here as well to prevent common UX lag between API requests
      return this.matches.filter((match) => {
        return hasMatch(match['organization_name'], this.inputValue)
        || hasMatch(match['description'], this.inputValue);
      });
    },
    hasMatches() {
      return this.filteredMatches.length >= 0 && this.inputValue !== '';
    },
    hasInputValue() {
      return this.inputValue.length > 0;
    },
  },
  methods: {
    fetchProposals(query) {
      try {
        const url = `/api/proposals`
        var request = new XMLHttpRequest();
        request.open('GET', url, true);

        var context = this
        request.onload = function() {
          if (this.status >= 200 && this.status < 400) {
            const results = JSON.parse(this.response);
            context.matches = results.map((row) => {
              return {
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
              }
            });
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
    },
    generateViewUrl(id) {
      return `/ux/review/${id}`;
    }
  },

  template: `
<div class="row">
  <div class="col-12">
    <input class="form-control"
      v-model="inputValue"
      @input="handleInput"
      >
  </div>
</div>
<div>
  <div v-for="match in filteredMatches" class="proposal row">
    <div class="col-12">
      <h2>{{ match.organization_name }} ({{ match.organization_registration_number }})</h2>
      {{ match.description }}
      <div><a :href='generateViewUrl(match.id)'>(view)</a></div>
    </div>
  </div>
</div>
`
})
