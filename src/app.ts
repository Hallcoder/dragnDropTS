//project state management class

class ProjectState{
  private listeners:any[] = [];
  private projects:any[] = [];
  private static instance:ProjectState;
  private constructor(){

  }
  static getInstance(){
    if(this.instance){
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addListener(listenerfn:Function){
    this.listeners.push(listenerfn)
  }

  addProject(title:string,description:string,numOfPeople:number){
    const newProject = {
      id:Math.random().toString(),
      title,
      description,
      people:numOfPeople
    }
    this.projects.push(newProject);
  }
}

const projectState = ProjectState.getInstance();

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
    if (validatableInput.max != null && typeof validatableInput.value === 'number'){
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

class ProjectList{
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;

  constructor(private type:'active' | 'finished'){
    this.templateElement = <HTMLTemplateElement>(
      document.getElementById("project-list")!
    );
    this.hostElement = <HTMLDivElement>document.getElementById("app");

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLElement;
    this.element.id = `${this.type}-projects`;
    this.attach();
    this.renderContent()
  }
private renderContent(){
  const listId=`${this.type}-projects-list`;
  this.element.querySelector('ul')!.id = listId;
  this.element.querySelector('h2')!.textContent =
    this.type.toUpperCase() + ' PROJECTS';
  
}
private attach(){
  this.hostElement.insertAdjacentElement("beforeend", this.element);
}
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
        required:true,
        minLength:5
    }
    const descriptionValidatable: Validatable = {
      value:enteredDescription,
      required:true,
    }
    const peopleValidatable: Validatable = {
      value:enteredPeople,
      required:true,
      min:0,
      max:2
    }
    if (
      !Validate(titleValidatable) ||
      !Validate(descriptionValidatable) ||
      !Validate(peopleValidatable)
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
        const [title,description,people] = userInput;
        projectState.addProject(title,description,people);
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
const activeProjectsList = new ProjectList('active');
const finishedProjectsList = new ProjectList('finished');
