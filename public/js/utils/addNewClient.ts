// when "Add new..." option is selected
const addNewClient = (
  projectsList: HTMLSelectElement,
  createClientForm: HTMLFormElement,
) => {
  projectsList.addEventListener('change', (e: Event) => {
    const selectValue = (e.target as HTMLInputElement).value;
    if (selectValue === 'create') {
      createClientForm.style = 'visible';
    } else {
      // hide form is selecting another option
      createClientForm.style.display = 'none';
    }
  });
};

export default addNewClient;
