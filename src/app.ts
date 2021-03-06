// Validation 
interface Validatable {
  value: string | number; 
  required? : boolean; 
  minLength?: number ;
  maxLength?: number;
  min?: number ; 
  max?: number;
}
//  create validate fun 
function validate(validatableInput : Validatable) { 
  let isValid = true;
  if (validatableInput.required) { 
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }
  if (validatableInput.minLength != null && typeof validatableInput.value === 'string'){ 
    isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
  }

  if (validatableInput.maxLength != null && typeof validatableInput.value === 'string'){ 
    isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
  }

  if (validatableInput.min != null && typeof validatableInput.value === 'number'){ 
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }

  if (validatableInput.max != null && typeof validatableInput.value === 'number'){ 
    isValid = isValid && validatableInput.value <= validatableInput.max;
  }
  return isValid;
}

// autobind decorator
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescription: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescription;
}
// ProjectInput Class
class ProjectInput {
  public templateElement: HTMLTemplateElement; // template element to get project input
  public hostElement: HTMLDivElement; // div element to host the app
  public element: HTMLFormElement; // form element
  public titleInputElement: HTMLInputElement;
  public descriptionInputElement: HTMLInputElement;
  public peopleInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    ); // get template content
    this.element = importedNode.firstElementChild as HTMLFormElement; // set form element to equal to first form in template
    this.element.id = "user-input";

    this.titleInputElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;

    this.configure();
    this.attach(); // this will insert the form into the app-div element
  }

  // for input gathering and validate
  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    const titleValidatable : Validatable = { 
      value : enteredTitle , 
      required: true
    }
    const descriptionValidatable : Validatable = { 
      value : enteredDescription , 
      required: true,
      minLength: 5
    }
    const peopleValidatable : Validatable = { 
      value : +enteredPeople , 
      required: true, 
      min: 1, 
      max: 5
    }
    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable)||
      !validate(peopleValidatable)
    ) {
      alert('invalid input , please try')
      return;
    } else { 
      return  [enteredTitle , enteredDescription , +enteredPeople];
    }
  }
  private clearInputs() {
    this.titleInputElement.value = ''\
    this.descriptionInputElement.value = ''
    this.peopleInputElement.value = ''
  }
  // there prob with this key word into submithander - it'sn refer to the element submited - so we have to bind it
  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput))  { 
      const [title, desc , people] = userInput;
      console.log(title, desc, people)
    }
    
  }

  private configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const prjinput = new ProjectInput();
