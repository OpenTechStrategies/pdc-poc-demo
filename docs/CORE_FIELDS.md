# Philanthropy Data Commons: Core Fields List

## How this list was made.

We looked at the common grant application fields across 9 funder and
funder-support organizations.  We selected the fields that were both
common and were either fairly static (like organization name, address,
etc) or quantitative (like organization annual budget, fiscal year,
proposal budget, etc).

This list was originally hosted in an [online
spreadsheet](https://docs.google.com/spreadsheets/d/18bzxgnA7SFkQLTkUMUXJQeqx88g_SNGkCAXpgMpF4Ss/edit#gid=444784014).
Now that the list has stabilized, we have moved it to this document
for easier revision control and publication.  We welcome [comments and
feedback](https://github.com/OpenTechStrategies/pdc-poc-demo/issues/new).

## Organization Fields

* **Org Name**

* **Org Mission Statement**

* **Org Website**

* **Org Entity Type (i.e., Tax Status)**

* **Org Registration Number (EIN / TIN)**

* **Org Address**

* **Org Phone**

* **Org Email**

* **Org DBA Name**

* **Org Banking Information (Bank, Routing Number, Account Number & Type)**

* **Org Legal Docs (articles of incorporation?  tax status affirmation?)**

* **Org Board Members (names and affiliations)**

* **Org CEO (or "Org Administrative Lead"): name, title, address, bio?**

* **Org Annual Operating Budget**

* **Org Lobbying Activities (this might be a yes/no question)**

* **Org Start Date ("date commenced operations")**

* **Org Geographic Areas ("In which geographic areas does your organization work?")**

* **Org Audited Financial Statements (last two years) OR Balance Sheet and Income Statement**

  *Not sure about this one... it only had a total score of 3.*

* **Org Grant Agreement Signatory**

* **Org Fiscal Year End Date**

  *Presumably the end date implies the start date.*

# Proposal Fields

* **Proposal Name(s)**

  *This may be a questionable & possibly sensitive field.  The same
  basic proposal may travel to different funders under different
  names, and it's not clear that the proposer necessarily wants each
  funder to see the "other" names.  So we're listing this as a field
  for now, but more discussion is needed to decide whether/how to
  include it.  One possibility is that it is included, in the sense
  that CGAP has the names and can match against them in topic-based
  searches, but that they are (at the grantseeker's option)
  confidential and never actually displayed to others.  However, if we
  already include Proposal Executive Summary or Proposal Description
  as a field, then we probably don't additionally need the Proposal
  Name(s) as something to match on in searches, in which case the
  prudent approach might be to just not collect the name data in the
  first place.*

* **Proposal Primary Contact Name, Email, and Phone Number**

* **Proposal Budget**

* **Proposal Investment Start Date**

  *Alt: "Project/Grant/Investment Length" (or "Duration")*

* **Proposal Investment End Date**

  *See comment for "Proposal Investment Start Date".*

* **Proposal Project Total Budget (including other funders, over entire duration)**

* **Proposal Type (GOS vs project-specific)**

  *We should define a set of canonical types here.  Maybe it's just
  two: General Operating Support vs project-specific?*

* **Proposal Fiscal Sponsorship Org Name**

  *Presumably the fiscal sponsor gets an Organizational entry of its
  own too.*

* **Proposal Location of Work (may imply an ED vs ER field)**

  *Where will work be done?  If international, then might need to sort
  out currency conversions, Equivalency Determination vs Expenditure
  Responsibility, etc.*

* **Proposal Involves Lobbying or Electioneering?  (Yes-or-No field)**

  *If there is lobbying as part of the project, then that has to be
  clearly broken out in the budget.*

* **IRB review needed?  And if so, IRB approval obtained?**

  *Needed if human subjects are involved.*

* **Are sub-grants being given?  If so, to whom?**

  *Partly to check for sub-grants to OFAC-sanctioned countries.*

* **Proposal Executive Summary?  Proposal Description?  Proposal Purpose?**

  *This field or fields would be somewhat looser than the others in
  terms of content.  Is it necessary?*

## Miscellaneous Notes

* *Interestingly, SDGs are nowhere represented here (and are not
  represented in the combined data in the original "App Compare and
  Contrast (extended)" sheet either).*

* *We might want to talk about ways to how to handle fiscal
  sponsorship relationships.*
