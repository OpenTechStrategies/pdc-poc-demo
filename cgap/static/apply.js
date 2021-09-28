const app = Vue.createApp({});

app.component('LinkedAutofillInput', {
  props: ['field', 'modelValue'],
  emits: ['update:modelValue'],
  data: function() {
    return {
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
        const fieldValue = match[this.field];
        return fieldValue.toLowerCase().indexOf(this.inputValue.toLowerCase()) >= 0;
      });
    },
    selectedMatch() {
      return this.matches[selectedMatchIndex];
    },
    hasSelection() {
      return this.modelValue && this.modelValue.id !== 0
    },
    hasMatches() {
      return this.filteredMatches.length >= 0 && this.inputValue !== '';
    },
    showAutocomplete() {
      return this.hasMatches && !this.hasSelection && this.hasFocus;
    },
    hasInputValue() {
      return this.inputValue.length > 0;
    },
    inputValue() {
      if(this.modelValue
        && this.modelValue[this.field]) {
        return this.modelValue[this.field];
      }
      return '';
    }
  },
  methods: {
    fetchOrganizations(query) {
      try {
        const url = `/api/organizations`
        var request = new XMLHttpRequest();
        request.open('GET', url, true);

        var context = this
        request.onload = function() {
          if (this.status >= 200 && this.status < 400) {
            const results = JSON.parse(this.response);
            context.matches = results.map((row) => {
              return {
                'id': row[0],
                'name': row[1],
                'mission_statement': row[2],
                'website': row[3],
                'entity_type': row[4],
                'registration_number': row[5],
                'address': row[6],
                'phone': row[7],
                'email': row[8],
                'dba_name': row[9],
                'ceo_name': row[10],
                'ceo_title': row[11],
                'ceo_address': row[12],
                'operating_budget': row[13],
                'is_lobbying': row[14],
                'start_date': row[15],
                'grant_agreement_signatory': row[16],
                'fiscal_end_date': row[17],
              }
            });
          }
        };

        request.onerror = function() {
          console.log('Could not load org data.');
        };

        request.send();
      } catch {}
    },
    getMatchValue(match) {
      return match[this.field]
    },
    makeSelection(selection) {
      this.$emit('update:modelValue', selection)
      console.log(this.modelValue);
    },
    updateModel(updatedValue) {
      this.$emit('update:modelValue', updatedValue)
    },
    handleInput(event) {
      const updatedValue = {
        ...this.modelValue
      }
      updatedValue[this.field] = event.target.value;
      this.updateModel(updatedValue);
      this.fetchOrganizations(event.target.value);
    }
  },

  template: `
<input class="form-control"
  :value="inputValue"
  @input="handleInput"
  v-bind="$attrs"
  @focus="hasFocus = true"
  @blur="hasFocus = false"
  >
<div v-show="showAutocomplete" class="autocomplete">
  <ul>
    <li v-for="match in filteredMatches"
      @mousedown.prevent="makeSelection(match)"
      >{{ getMatchValue(match) }} :: {{ match.name }} ({{ match.registration_number }})</li>
  </ul>
</div>
`
})


app.component('AutofillForm', {
  data: function() {
    return {
      organization: {
        'id': 0,
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
        'is_lobbying': 'false',
        'start_date': '',
        'grant_agreement_signatory': '',
        'fiscal_end_date': '',
      },
      proposal: {
        'id': '',
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

  methods: {
    updateOrganization(organization) {
      var request = new XMLHttpRequest();
      var formData = new FormData();
      for ( var key in organization ) {
        formData.append(key, organization[key]);
      }
      request.open('POST', '/api/organizations/' + organization.id, true);
      request.send(formData);
    },

    createOrganization(organization, cb) {
      var request = new XMLHttpRequest();
      var formData = new FormData();
      for ( var key in organization ) {
        formData.append(key, organization[key]);
      }
      request.open('POST', '/api/organizations', true);
      const context = this;
      request.onreadystatechange = function() {
        if (request.readyState == XMLHttpRequest.DONE) {
          newOrganization = JSON.parse(this.response);
          console.log(newOrganization);
          context.organization.id = newOrganization[0];
          cb();
        }
      }
      request.send(formData);
    },

    createProposal(proposal, organizationId) {
      var request = new XMLHttpRequest();
      var formData = new FormData();
      for ( var key in proposal ) {
        formData.append(key, proposal[key]);
      }
      formData.append('organization_id', organizationId)
      console.log(formData)
      console.log(proposal)
      console.log(organizationId)
      request.open('POST', '/api/proposals', true);
      request.send(formData);
    },

    submitForm() {
      if (this.organization.id !== 0) {
        this.updateOrganization(this.organization)
        this.createProposal(this.proposal, this.organization.id)
      } else {
        this.createOrganization(this.organization, () => {
          this.createProposal(this.proposal, this.organization.id)
        })
      }
    }
  },

  template: `
<fieldset>
<legend>Organization</legend>
<div class="mb-3">
  <label for="orgName" class="form-label">Organization Name</label>
  <linked-autofill-input v-model="organization" field="name" name='orgName' id='orgName'></linked-autofill-input>
</div>
<div class="mb-3">
  <label for="orgMissionStatement" class="form-label">Organization Mission</label>
  <textarea v-model='organization.mission_statement' name='orgMissionStatement' id='orgMissionStatement' class="form-control"></textarea>
</div>
<div class="mb-3">
  <label for="orgWebsite" class="form-label">Organization Website</label>
  <linked-autofill-input v-model="organization" field="website" name='orgWebsite' id='orgWebsite'></linked-autofill-input>
</div>
<div class="mb-3">
  <label for="orgEntityType" class="form-label">Entity Type</label>
  <select id="orgEntityType" class="form-select">
    <option value="501c3">501(c)(3)</option>
  </select>
</div>
<div class="mb-3">
  <label for="orgRegistrationNumber" class="form-label">Registration Number</label>
  <linked-autofill-input v-model="organization" field="registration_number" name='orgRegistrationNumber' id='orgRegistrationNumber' aria-describedby="orgRegistrationNumberHelp"></linked-autofill-input>
  <div id="orgRegistrationNumberHelp" class="form-text">(e.g. EIN / TIN)</div>
</div>
<div class="mb-3">
  <label for="orgAddress" class="form-label">Organization Address</label>
  <linked-autofill-input v-model="organization" field="address" name='orgAddress' id='orgAddress'></linked-autofill-input>
</div>
<div class="mb-3">
  <label for="orgPhone" class="form-label">Organization Phone</label>
  <linked-autofill-input v-model="organization" field="phone" name='orgPhone' id='orgPhone'></linked-autofill-input>
</div>
<div class="mb-3">
  <label for="orgEmail" class="form-label">Organization Email</label>
  <linked-autofill-input v-model="organization" field="email" name='orgEmail' id='orgEmail'></linked-autofill-input>
</div>
<div class="mb-3">
  <label for="orgDba" class="form-label">Organization DBA</label>
  <linked-autofill-input v-model="organization" field="dba_name" name='orgDba' id='orgDba'></linked-autofill-input>
</div>
<div class="mb-3">
  <label for="orgDba" class="form-label">Legal Documents</label>
  (To be implemented...)
</div>
<div class="mb-3">
  <fieldset>
    <legend>Board Members</legend>
    <div class="row">
      <div class="col-sm-6">
        <input type="text" class="form-control" placeholder="Name" aria-label="Name">
      </div>
      <div class="col-sm-6">
        <input type="text" class="form-control" placeholder="Affiliation" aria-label="Affiliation">
      </div>
    </div>
  </fieldset>
</div>
<div class="mb-3">
  <label for="orgCeoName" class="form-label">CEO / Administrative Lead</label>
  <linked-autofill-input v-model="organization" field="ceo_name" name='orgCeoName' id='orgCeoName'></linked-autofill-input>
</div>
<div class="mb-3">
  <label for="orgOperatingBudget" class="form-label">Operating Budget</label>
  <input type="text" name='orgOperatingBudget' id='orgOperatingBudget' class="form-control">
</div>
<div class="mb-3 form-check">
  <input v-model="organization.is_lobbying" type="checkbox" class="form-check-input" name="orgIsLobbying" id="orgIsLobbying">
  <label class="form-check-label" for="orgIsLobbying">We engage in lobbying activities</label>
</div>
<div class="mb-3">
  <label for="orgStartDate" class="form-label">Organization Start Date</label>
  <linked-autofill-input v-model="organization" field="start_date" name='orgStartDate' id='orgStartDate'></linked-autofill-input>
</div>
<div class="mb-3">
  <label for="orgWorkLocations" class="form-label">Work Locations</label>
  (To be implemented...)
</div>
<div class="mb-3">
  <label for="orgFinancialStatements" class="form-label">Financial Statements</label>
  (To be implemented...)
</div>
<div class="mb-3">
  <label for="orgSignatory" class="form-label">Grant Agreement Signatory</label>
  <linked-autofill-input v-model="organization" field="grant_agreement_signatory" name='orgSignatory' id='orgSignatory'></linked-autofill-input>
</div>
<div class="mb-3">
  <label for="orgFiscalEndDate" class="form-label">Organization Fiscal End Date</label>
  <linked-autofill-input v-model="organization" field="fiscal_end_date" name='orgFiscalEndDate' id='orgFiscalEndDate'></linked-autofill-input>
</div>
</fieldset>
<fieldset>
<legend>Proposal</legend>
<div class="mb-3">
  <label for="proposalContact" class="form-label">Primary Contact Name</label>
  <input type="text" v-model='proposal.primary_contact_name' name='proposalContactName' id='proposalContactName' class="form-control">
</div>
<div class="mb-3">
  <label for="proposalRequestedBudget" class="form-label">Requested Budget</label>
  <input type="text" v-model='proposal.requested_budget' name='proposalRequestedBudget' id='proposalRequestedBudget' class="form-control">
</div>
<div class="mb-3">
  <label for="proposalStartDate" class="form-label">Investment Start Date</label>
  <input type="text" v-model='proposal.investment_start_date' name='proposalStartDate' id='proposalStartDate' class="form-control">
</div>
<div class="mb-3">
  <label for="proposalEndDate" class="form-label">Investment End Date</label>
  <input type="text" v-model='proposal.investment_end_date' name='proposalEndDate' id='proposalEndDate' class="form-control">
</div>
<div class="mb-3">
  <label for="proposalTotalBudget" class="form-label">Total Project Budget</label>
  <input type="text" v-model='proposal.total_budget' name='proposalTotalBudget' id='proposalTotalBudget' class="form-control">
</div>
<div class="mb-3">
  <label for="proposalFiscalSponsor" class="form-label">Fiscal Sponsor Organization</label>
  <input type="text" v-model='proposal.fiscal_sponsor_name' name='proposalFiscalSponsor' id='proposalFiscalSponsor' class="form-control">
</div>
<div class="mb-3">
  <label for="proposalDescription" class="form-label">Executive Summary</label>
  <textarea v-model='proposal.description' name='proposalDescription' id='proposalDescription' class="form-control"></textarea>
</div>
</fieldset>
<button type="submit" class="btn btn-primary"
  @click.prevent="submitForm">Submit</button>
`
})
