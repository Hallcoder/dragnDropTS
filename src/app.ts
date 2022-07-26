
interface Validatable{
    value:string | number;
    required?:Boolean;
    minLength?:number;
    maxLength?:number;
    min?:number;
    max?:number;
}

function Validate(validatableInput:Validatable){
    let isValid = true;
    if(validatableInput.required){
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }
    if(validatableInput.minLength != null && typeof validatableInput.value ==='string'){
        isValid  = isValid && validatableInput.value.length > validatableInput.minLength; 
    }
    if(validatableInput.maxLength != null && typeof validatableInput.value ==='string'){
        isValid  = isValid && validatableInput.value.length < validatableInput.maxLength;  
    }
    if (validatableInput.min != null && typeof validatableInput.value ==='number'){
        isValid = isValid && validatableInput.value > validatableInput.min;
    }
    if (validatableInput.max != null && typeof validatableInput.value ==='number'){
        isValid = isValid && validatableInput.value < validatableInput.max;
    }
    return isValid;
}

function AutoBind(target: any, name: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}

class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;
  constructor() {
    this.templateElement = <HTMLTemplateElement>(
      document.getElementById("project-input")!
    );
    this.hostElement = <HTMLDivElement>document.getElementById("app");

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = "user-input";

    this.titleInputElement = <HTMLInputElement>(
      this.element.querySelector("#title")
    );
    this.descriptionInputElement = <HTMLInputElement>(
      this.element.querySelector("#description")
    );
    this.peopleInputElement = <HTMLInputElement>(
      this.element.querySelector("#people")
    );
    this.configure();
    this.attach();
  }
  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    const titleValidatable: Validatable = {
        value:enteredTitle,
        
    }

    if (
      enteredTitle.trim().length === 0 ||
      enteredDescription.trim().length === 0 ||
      enteredPeople.trim().length === 0
    ) {
      alert("Invalid input");
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }
  private clearInputs(){
    this.titleInputElement.value = '';
    this.descriptionInputElement.value  = '';
    this.peopleInputElement.value = '';
  }
  @AutoBind
  private submitHandler(e: Event) {
    e.preventDefault();
    const userInput = this.gatherUserInput();
    if(Array.isArray(userInput)){
        const [title,description,people] = userInput
        console.log(title,description,people); 
    }
  }

  private configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }
  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const projectInput = new ProjectInput();
