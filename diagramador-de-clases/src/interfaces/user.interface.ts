export interface UserInfo {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface RegisterElements extends HTMLFormControlsCollection {
  firstName: HTMLInputElement;
  lastName: HTMLInputElement;
  email: HTMLInputElement;
  password: HTMLInputElement;
}

export interface RegisterCustomForm extends HTMLFormElement {
  readonly elements: RegisterElements;
}