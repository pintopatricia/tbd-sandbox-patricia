const {
  RUNNER_DETAILS,
  RUNNER_DETAILS_AGE_LABEL,
  RUNNER_DETAILS_AGE,
  RUNNER_DETAILS_WEIGHT_LABEL,
  RUNNER_DETAILS_WEIGHT,
  RUNNER_DETAILS_OFFICIAL_RATING_LABEL,
  RUNNER_DETAILS_OFFICIAL_RATING,
  RUNNER_DETAILS_FORM_LABEL,
  RUNNER_DETAILS_FORM,
  RUNNER_DETAILS_COLOR_LABEL,
  RUNNER_DETAILS_COLOR,
  RUNNER_DETAILS_GENDER_LABEL,
  RUNNER_DETAILS_GENDER,
  RUNNER_DETAILS_EQUIPMENT_LABEL,
  RUNNER_DETAILS_EQUIPMENT,
  RUNNER_DETAILS_SIRE_LABEL,
  RUNNER_DETAILS_SIRE,
  RUNNER_DETAILS_DAM_LABEL,
  RUNNER_DETAILS_DAM,
  RUNNER_DETAILS_DAM_SIRE_LABEL,
  RUNNER_DETAILS_DAM_SIRE,
  RUNNER_DETAILS_BRED_LABEL,
  RUNNER_DETAILS_BRED,
  RUNNER_DETAILS_TIMEFORM_LOGO_CONTAINER,
  RUNNER_DETAILS_TIMEFORM_LOGO,
  RUNNER_DETAILS_TIMEFORM_COMMENT,
  RUNNER_DETAILS_TIMEFORM_SECTION,
  RUNNER_DETAILS_GRAPHS_LABEL,
  RUNNER_DETAILS_GRAPHS_CONTAINER,
  RUNNER_DETAILS_PEDIGREE_LABEL,
  RUNNER_DETAILS_PEDIGREE,
  RUNNER_DETAILS_GRAPHS_ICON,
  RUNNER_DETAILS_TIMEFORM_COMMENT_CONTAINER,
} = require("@ppb/the-wall-native/components/RunnerDetails/RunnerDetails.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class RunnerDetailsSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${RUNNER_DETAILS}`));
  }

  get ageLabel() {
    return this.element.$(`~${RUNNER_DETAILS_AGE_LABEL}`);
  }

  get age() {
    return this.element.$(`~${RUNNER_DETAILS_AGE}`);
  }

  get weightLabel() {
    return this.element.$(`~${RUNNER_DETAILS_WEIGHT_LABEL}`);
  }

  get weight() {
    return this.element.$(`~${RUNNER_DETAILS_WEIGHT}`);
  }

  get officialRatingLabel() {
    return this.element.$(`~${RUNNER_DETAILS_OFFICIAL_RATING_LABEL}`);
  }

  get officialRating() {
    return this.element.$(`~${RUNNER_DETAILS_OFFICIAL_RATING}`);
  }

  get bredLabel() {
    return this.element.$(`~${RUNNER_DETAILS_BRED_LABEL}`);
  }

  get bred() {
    return this.element.$(`~${RUNNER_DETAILS_BRED}`);
  }

  get formLabel() {
    return this.element.$(`~${RUNNER_DETAILS_FORM_LABEL}`);
  }

  get form() {
    return this.element.$(`~${RUNNER_DETAILS_FORM}`);
  }

  get colorLabel() {
    return this.element.$(`~${RUNNER_DETAILS_COLOR_LABEL}`);
  }

  get color() {
    return this.element.$(`~${RUNNER_DETAILS_COLOR}`);
  }

  get genderLabel() {
    return this.element.$(`~${RUNNER_DETAILS_GENDER_LABEL}`);
  }

  get gender() {
    return this.element.$(`~${RUNNER_DETAILS_GENDER}`);
  }

  get equipmentLabel() {
    return this.element.$(`~${RUNNER_DETAILS_EQUIPMENT_LABEL}`);
  }

  get equipment() {
    return this.element.$(`~${RUNNER_DETAILS_EQUIPMENT}`);
  }

  get sireLabel() {
    return this.element.$(`~${RUNNER_DETAILS_SIRE_LABEL}`);
  }

  get sire() {
    return this.element.$(`~${RUNNER_DETAILS_SIRE}`);
  }

  get damLabel() {
    return this.element.$(`~${RUNNER_DETAILS_DAM_LABEL}`);
  }

  get dam() {
    return this.element.$(`~${RUNNER_DETAILS_DAM}`);
  }

  get damSireLabel() {
    return this.element.$(`~${RUNNER_DETAILS_DAM_SIRE_LABEL}`);
  }

  get damSire() {
    return this.element.$(`~${RUNNER_DETAILS_DAM_SIRE}`);
  }

  get timeformTextSection() {
    return this.element.$(`~${RUNNER_DETAILS_TIMEFORM_COMMENT_CONTAINER}`);
  }

  get timeformLogoContainer() {
    return this.element.$(`~${RUNNER_DETAILS_TIMEFORM_LOGO_CONTAINER}`);
  }

  get timeformLogo() {
    return this.element.$(`~${RUNNER_DETAILS_TIMEFORM_LOGO}`);
  }

  get timeformComment() {
    return this.element.$(`~${RUNNER_DETAILS_TIMEFORM_COMMENT}`);
  }

  get timeformSection() {
    return this.element.$(`~${RUNNER_DETAILS_TIMEFORM_SECTION}`);
  }

  get graphsContainer() {
    return this.element.$(`~${RUNNER_DETAILS_GRAPHS_CONTAINER}`);
  }

  get graphsIcon() {
    return this.element.$(`~${RUNNER_DETAILS_GRAPHS_ICON}`);
  }

  get graphsLabel() {
    return this.element.$(`~${RUNNER_DETAILS_GRAPHS_LABEL}`);
  }

  get pedigreeLabel() {
    return this.element.$(`~${RUNNER_DETAILS_PEDIGREE_LABEL}`);
  }

  get pedigree() {
    return this.element.$(`~${RUNNER_DETAILS_PEDIGREE}`);
  }
}

module.exports = RunnerDetailsSO;
