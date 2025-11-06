(function (window, document, undefined) {
  const prescriptionIdFieldName = 'vm.Prescription.ID';
  const patientIdFieldName = 'vm.Patient.PatientIDValue';
  const firstNameFieldName = 'vm.Patient.FirstName';
  const lastNameFieldName = 'vm.Patient.LastName';
  const patientAddressFieldName = 'vm.Patient.AddressText';
  const drugTitleFieldName = 'vm.MedicalTreatment.DrugTitle';
  const usageInstructionsFieldName = 'vm.UseInstructions.UseInstruction';

  const normalImagePath = 'img/copy-regular-24.png';
  const successImagePath = 'img/check-24.png';
  const normalText = 'Kopēt recepti';
  const successText = 'Nokopēta!';

  let buttonTimeout;

  // Create if not exists the copy button and append it in the button row
  function addButton() {
    if (!!document.querySelector('.RadButton.copyButton')) {
      return;
    }

    const breadCrumbs = document.querySelector('.portalBreadcrumbs');
    if (!breadCrumbs) {
      return;
    }

    const imageUrl = chrome.runtime.getURL(normalImagePath);

    const input = document.createElement('input');
    input.setAttribute('type', 'submit');
    input.setAttribute('value', normalText);
    input.style.backgroundImage = `url(${imageUrl})`;

    const copyButton = document.createElement('a');
    copyButton.className =
      'RadButton RadButton_Default rbSkinnedButton copyButton';
    copyButton.appendChild(input);
    copyButton.addEventListener('click', clickHandler);

    breadCrumbs.parentElement.appendChild(copyButton);
  }

  function removeButton() {
    if (!document.querySelector('.RadButton.copyButton')) {
      return;
    }

    document.querySelector('.RadButton.copyButton').remove();
  }

  function clickHandler(event) {
    event.stopPropagation();
    event.preventDefault();

    collectValues();

    event.target.blur();

    return false;
  }

  // Collect the prescription values and put them into clipboard
  function collectValues(labels) {
    if (!labels) {
      labels = document.querySelectorAll('portal-form-label');
    }
    if (labels.length === 0) {
      window.console.log('no labels found');
      return;
    }

    const fullInfo = Array.from(labels).reduce((acc, label) => {
      if (label.getAttribute('field') === prescriptionIdFieldName) {
        return {
          ...acc,
          prescriptionId: label.querySelector('.ng-binding[ng-bind-html=field]')
            .innerText,
        };
      }

      if (label.getAttribute('field') === patientIdFieldName) {
        return {
          ...acc,
          patientId: label.querySelector('.ng-binding[ng-bind-html=field]')
            .innerText,
        };
      }

      if (label.getAttribute('field') === firstNameFieldName) {
        return {
          ...acc,
          firstName: label.querySelector('.ng-binding[ng-bind-html=field]')
            .innerText,
        };
      }

      if (label.getAttribute('field') === lastNameFieldName) {
        return {
          ...acc,
          lastName: label.querySelector('.ng-binding[ng-bind-html=field]')
            .innerText,
        };
      }

      if (label.getAttribute('field') === patientAddressFieldName) {
        return {
          ...acc,
          patientAddress: label.querySelector('.ng-binding[ng-bind-html=field]')
            .innerText,
        };
      }

      if (label.getAttribute('field') === drugTitleFieldName) {
        return {
          ...acc,
          drugTitle: label.querySelector('.ng-binding[ng-bind-html=field]')
            .innerText,
        };
      }

      if (label.getAttribute('field') === usageInstructionsFieldName) {
        return {
          ...acc,
          usageInstructions: label.querySelector(
            '.ng-binding[ng-bind-html=field]'
          ).innerText,
        };
      }

      return acc;
    }, {});

    window.console.log('fullInfo', fullInfo);
    window.navigator.clipboard.writeText(JSON.stringify(fullInfo));

    setSuccessButton();

    return false;
  }

  function setSuccessButton() {
    if (buttonTimeout) {
      clearTimeout(buttonTimeout);
    }

    const button = document.querySelector('.RadButton.copyButton');
    if (!button) {
      return;
    }

    const input = button.querySelector('input');
    if (!input) {
      return;
    }

    setTimeout(resetButton, 1500);

    const imageUrl = chrome.runtime.getURL(successImagePath);

    button.classList.add('copied-animated');
    input.value = successText;
    input.style.backgroundImage = `url(${imageUrl})`;
  }

  function resetButton() {
    const button = document.querySelector('.RadButton.copyButton');
    if (!button) {
      return;
    }

    const input = button.querySelector('input');
    if (!input) {
      return;
    }

    const imageUrl = chrome.runtime.getURL(normalImagePath);

    button.classList.remove('copied-animated');
    input.value = normalText;
    input.style.backgroundImage = `url(${imageUrl})`;
  }

  function checkAndToggleButton() {
    const prescriptionIdExists =
      document.querySelector(
        `portal-form-label[field="${prescriptionIdFieldName}"]`
      ) != null;
    const buttonExists =
      document.querySelector('.RadButton.copyButton') != null;

    if (prescriptionIdExists && !buttonExists) {
      addButton();
    } else if (!prescriptionIdExists && buttonExists) {
      removeButton();
    }
  }

  function init() {
    const content = document.getElementById('content');
    if (!content) {
      return;
    }

    // set up mutation observer
    const observer = new MutationObserver(checkAndToggleButton);
    observer.observe(content, { childList: true, subtree: true });

    // check if button needed on extension startup
    checkAndToggleButton();

    window.addEventListener('unload', () => {
      observer.disconnect();
    });
  }

  // Main part
  init();
})(this, this.document);
